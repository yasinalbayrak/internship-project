import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { fetchData } from '../../../../service/apiService';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./DoctorAvailableSpaces.css"
import { CalendarIcon } from '@mui/x-date-pickers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faL } from '@fortawesome/free-solid-svg-icons';
import { Block } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

   

export default function DoctorAvailableSpaces() {
    const navigate = useNavigate();
    const today = new Date();
    // Data fetch
    const [data, setData] = useState(null)
    const [doctorAppointments, setDoctorAppointments] = useState([])

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date());

    const [currentDates, setCurrentDates] = useState({
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: ""
    })

    const [booking, setBooking] = useState(false)

    const currentDate = new Date().setHours(0, 0, 0, 0);
    const numRows = 7;
    const numCols = 10;

    const initialAvailableSpace = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => 1));

    const [availableSpace, setAvailableSpace] = useState(initialAvailableSpace);



    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const doctorId = searchParams.get('id');


    function formatDate(inputDate, option = 1) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const date = new Date(inputDate);
        const dayOfWeek = daysOfWeek[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        let formattedDate = ``
        if (option === 3) {
            formattedDate += `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} `
        }
        if (option !== 1) {
            formattedDate += `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
        if (option !== 3) {
            formattedDate += ` ${dayOfWeek} ${day} ${month} ${year}`;
        }

        return formattedDate;
    }

    function myFormatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        const formattedDate = `${day.toString().length === 2 ? day : '0' + day}/${month.toString().length === 2 ? month : '0' + month}/${year.toString().slice(2, 4)}`;
        return formattedDate;
    }
    function isInTheCurrentWeek(date) {

        const sunday = getNDayNextOrPrev(startDate, diffWithSunday(startDate), 1)
        const monday = getNDayNextOrPrev(startDate, diffWithMonday(startDate), 2)

        return date >= monday && date <= sunday.setHours(18, 0, 0);

    }
    function diffWithSunday(date) {
        return date.getDay() === 0 ? 0 : 7 - date.getDay()
    }
    function diffWithMonday(date) {



        return date.getDay() === 0 ? 6 : date.getDay() - 1
    }


    function getNDayNextOrPrev(dateTime, n, which) {
        const newDay = new Date(dateTime);

        const addOrSubtract = which === 1 ? n : -n
        newDay.setDate(dateTime.getDate() + addOrSubtract);
        return newDay;

    }
    function getNextorPrevDay(dateTime, which) {
        const newDay = new Date(dateTime);
        const addOrSubtract = which === 1 ? 1 : -1
        newDay.setDate(dateTime.getDate() + addOrSubtract);
        return newDay;
    }

    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const nextDay = () => {
        fixBookedSlots()
        setBooking(false)
        setStartDate((prev) => {
            return getNextorPrevDay(prev, 1)
        })
    }
    const prevDay = () => {
        fixBookedSlots()
        setBooking(false)
        setStartDate((prev) => {
            return getNextorPrevDay(prev, 2)
        })
    }

    const changeNthRowToM = (n, m) => {
        setAvailableSpace((prev) => {
            const updatedSpace = [...prev];
            updatedSpace[n] = Array.from({ length: numCols }, () => m);;
            return updatedSpace;
        });
    };

    const changeCellToN = (row, col, n) => {
        setAvailableSpace((prev) => {
            const updatedSpace = [...prev];
            updatedSpace[row][col] = n;
            return updatedSpace;
        });
    };
    function diffWithStartHour(date) {
        return date.getHours() - 8
    }
    function getDateOneHourLater(date) {
        const currentDate = new Date(date);
        const oneHourLater = new Date(currentDate.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds

        return oneHourLater;
    }

    function handleInitialSpaces() {
        const mondayDiff = diffWithMonday(today)
        setCurrentDates((prev) => {

            const mndDiff = diffWithMonday(startDate)
            const updated = { ...prev }
            updated[0] = getNDayNextOrPrev(startDate, mndDiff, 2)
            updated[1] = getNDayNextOrPrev(updated[0], 1, 1)
            updated[2] = getNDayNextOrPrev(updated[1], 1, 1)
            updated[3] = getNDayNextOrPrev(updated[2], 1, 1)
            updated[4] = getNDayNextOrPrev(updated[3], 1, 1)
            updated[5] = getNDayNextOrPrev(updated[4], 1, 1)
            updated[6] = getNDayNextOrPrev(updated[5], 1, 1)

            return updated
        })
        const diff = startDate - getNDayNextOrPrev(today, mondayDiff, 2).setHours(0, 0, 0)
        const daysDifference = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (daysDifference <= 6) {
            let num = 0
            while (num !== mondayDiff) {
                changeNthRowToM(num, 0)
                num++
            }


            const startHourDiff = diffWithStartHour(today)


            if (startHourDiff >= 10) {
                changeNthRowToM(num, 0)
            }
            else {
                for (let index = 0; index <= startHourDiff; index++) {
                    changeCellToN(num, index, 0)
                }
            }
        } else {
            const diff2 = startDate - currentDates[0].setHours(0, 0, 0)
            const daysDifference2 = Math.floor(diff2 / (1000 * 60 * 60 * 24));
            if (daysDifference2 > 6) {

                for (let index = 1; index <= 7; index++) {
                    const element = changeNthRowToM(index - 1, 1);

                }
            }

        }





        const sundayDiff = diffWithSunday(startDate)

        doctorAppointments.forEach(
            (Appointment) => {
                const date = new Date(Appointment.date)
                //console.log(" ne " , date.getDay())
                if (isInTheCurrentWeek(date) && Appointment.status === 'ACTIVE') {
                    //console.info("DATE iss", date)
                    const diffWithMonday1 = diffWithMonday(date)
                    const diffWithStartHour1 = diffWithStartHour(date)

                    changeCellToN(diffWithMonday1, diffWithStartHour1, 0)

                }
            }
        )
    }

    useEffect(() => {
        handleInitialSpaces();
    }, [doctorAppointments, startDate]);

    useEffect(() => {

        const fetchDataFromApi = async () => {
            try {
                const url = `/api/v1/user/doctor/${doctorId}`;
                const options = {
                    method: 'GET',
                    headers: {
                        //"Authorization": Cookies.get("token")
                    }
                };
                const app_url = `/api/v1/appointment/doctor/${doctorId}`

                const fetchedData = await fetchData(url, options);
                const fetchData2 = await fetchData(app_url, options)

                setData(fetchedData);
                setDoctorAppointments(fetchData2)


                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDataFromApi();
    }, []);
    const CustomInput = ({ value, onClick }) => (
        <button
            className={`custom-date-button ${isDatePickerOpen ? 'active' : ''}`}
            onClick={onClick}
        >
            <p className="go-to-date">Go to Date</p>
            <CalendarIcon />
        </button>


    );

    function findBookedDate() {
        let updatedSpace = [...availableSpace]


        let found = false; // Flag to track if a 2 is found
        var rowFound = 0;
        var colFound = 0;
        outerLoop: // Labeled outer loop
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                //console.log("Row: ", row, " col: " , col, " value: ", updatedSpace[row][col])
                if (updatedSpace[row][col] === 2) {
                    found = true; // Set the flag to true
                    rowFound = row
                    colFound = col
                    break outerLoop; // Break both loops
                }
            }
        }



        if (found) {
            const date = currentDates[rowFound]
            const hour = 8 + colFound
            const givenDate = new Date(date);
            givenDate.setHours(Number(hour), 0, 0);

            return givenDate.toString()
        }
        else {

        }


    }
    function fixBookedSlots(option = 1) {
        const updatedSpace = [...availableSpace]; // Create a copy of the array

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (updatedSpace[row][col] === 2) {
                    updatedSpace[row][col] = option === 2 ? 0 : 1; // Change the value from 2 to 1
                }
            }
        }

        setAvailableSpace(updatedSpace); // Update the state with the modified array
    }
    function handleBooking(row, col) {

        if (availableSpace[row][col] === 1) {
            setBooking(true)
            fixBookedSlots()
            changeCellToN(row, col, 2)
        }


    }
    function handleApprove() {
        try {


            setLoading(true)


            const url = `/api/v1/appointment`;

            const appointment = {
                "doctorID": parseInt(doctorId),
                "patientID": parseInt(localStorage.getItem("userID")),
                "date": formatDate(findBookedDate(), 3)
            }
            console.log("hellooo*****************\n", appointment)
            const options = {
                method: 'POST',
                headers: {
                    //"Authorization": Cookies.get("token")
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appointment)
            };


            const fetchedData = fetchData(url, options);
            setLoading(false);
            fixBookedSlots(2)
            setBooking(false)
            toast.success("Appointment is successfull!");

        } catch (error) {
            if (error.response) {
                // Extract and display the error message from the API response
                const responseData = error.response.json();
                const errorMessage = responseData.message || "Unknown error";
                toast.error("Error: " + error.response.statusText + ", " + errorMessage);
            } else {
                // Handle other errors
                console.log(error);
                toast.error("Error: " + error.message);
            }
        }


    }
    function handleCancel() {
        fixBookedSlots()
        setBooking(false)
    }


    return <>
        {//availableSpace && console.log("-----------------\n",startDate.getDay())
        }
        {data && <div className='otr-ctn'>
            <div className="back-bt">
                <button onClick={() => { navigate("/Profile") }}>
                    <div class="arrow-wrapper">
                        <div class="arrow"></div>
                    </div>
                    Profile
                </button>
            </div>
            <div className="inr-ctn">
                <div className="doctor-avatar">
                    <img src={data.user.gender === "MALE" ? "https://st3.depositphotos.com/1064969/15665/v/450/depositphotos_156656420-stock-illustration-doctor-avatar-icon.jpg" :'https://img.freepik.com/premium-vector/avatar-female-doctor-with-black-hair-doctor-with-stethoscope-vector-illustrationxa_276184-33.jpg?w=2000'}alt="Doctor Avatar" />
                </div>
                <div className="doctor-info-2">
                    <h2>Dr. {data.user.firstname + " " + data.user.lastname} ({data.user.age})</h2>
                    <h7>Specialized in <strong> {data.specialization}</strong></h7>
                    <p> {data.user.email}</p>
                </div>
            </div>
            <div className="date-info">
                <h2>{formatDate(startDate)}</h2>
                <div className="navigate-btns">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date)
                            setIsDatePickerOpen(false);

                        }}
                        customInput={<CustomInput />}
                        onCalendarOpen={() => setIsDatePickerOpen(true)}
                        onCalendarClose={() => setIsDatePickerOpen(false)}
                        minDate={new Date()}
                    />
                    <button
                        className="custom-date-button2"
                        onClick={prevDay}
                        disabled={startDate && isToday(startDate)}
                        style={startDate && isToday(startDate) ? { cursor: 'not-allowed' } : null}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                        className="custom-date-button2"
                        onClick={nextDay}
                        style={{ marginLeft: 0 }}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                    
                </div>


            </div>
            <div className="available-spaces">
                <div className="day-of-week">
                    <table>
                        <thead>

                            <th>Day</th>

                        </thead>
                        <tbody>
                            <tr >
                                <td className={startDate.getDay() === 1 ? 'active-day' : ''}>Monday</td>
                            </tr>
                            <tr >
                                <td className={startDate.getDay() === 2 ? 'active-day' : ''}>Tuesday</td>
                            </tr>
                            <tr >
                                <td className={startDate.getDay() === 3 ? 'active-day' : ''}>Wednesday</td>
                            </tr>
                            <tr >
                                <td className={startDate.getDay() === 4 ? 'active-day' : ''}>Thursday</td>
                            </tr>
                            <tr>
                                <td className={startDate.getDay() === 5 ? 'active-day' : ''}>Friday</td>
                            </tr>
                            <tr >
                                <td className={startDate.getDay() === 6 ? 'active-day' : ''}> Saturday</td>
                            </tr>
                            <tr >
                                <td className={startDate.getDay() === 0 ? 'active-day' : ''}>Sunday</td>
                            </tr>
                        </tbody>

                    </table>
                </div>
                <div className="time-picker">
                    <table>
                        <thead>

                            <th>08:00</th>
                            <th>09:00</th>
                            <th>10:00</th>
                            <th>11:00</th>
                            <th>12:00</th>
                            <th>13:00</th>
                            <th>14:00</th>
                            <th>15:00</th>
                            <th>16:00</th>
                            <th>17:00</th>
                            <th>18:00</th>


                        </thead>
                        <tbody>

                            <tr className={startDate.getDay() === 1 ? 'active-day' : '01'}>
                                <td className={availableSpace[0][0] === 1 ? 'available' : availableSpace[0][0] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 0) }}> </td>
                                <td className={availableSpace[0][1] === 1 ? 'available' : availableSpace[0][1] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 1) }}> </td>
                                <td className={availableSpace[0][2] === 1 ? 'available' : availableSpace[0][2] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 2) }}> </td>
                                <td className={availableSpace[0][3] === 1 ? 'available' : availableSpace[0][3] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 3) }}> </td>
                                <td className={availableSpace[0][4] === 1 ? 'available' : availableSpace[0][4] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 4) }}> </td>
                                <td className={availableSpace[0][5] === 1 ? 'available' : availableSpace[0][5] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 5) }}> </td>
                                <td className={availableSpace[0][6] === 1 ? 'available' : availableSpace[0][6] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 6) }}> </td>
                                <td className={availableSpace[0][7] === 1 ? 'available' : availableSpace[0][7] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 7) }}> </td>
                                <td className={availableSpace[0][8] === 1 ? 'available' : availableSpace[0][8] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 8) }}> </td>
                                <td className={availableSpace[0][9] === 1 ? 'available' : availableSpace[0][9] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(0, 9) }}> </td>
                                <td></td>

                            </tr>
                            <tr className={startDate.getDay() === 2 ? 'active-day' : '02'}>
                                <td className={availableSpace[1][0] === 1 ? 'available' : availableSpace[1][0] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 0) }}> </td>
                                <td className={availableSpace[1][1] === 1 ? 'available' : availableSpace[1][1] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 1) }}> </td>
                                <td className={availableSpace[1][2] === 1 ? 'available' : availableSpace[1][2] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 2) }}> </td>
                                <td className={availableSpace[1][3] === 1 ? 'available' : availableSpace[1][3] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 3) }}> </td>
                                <td className={availableSpace[1][4] === 1 ? 'available' : availableSpace[1][4] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 4) }}> </td>
                                <td className={availableSpace[1][5] === 1 ? 'available' : availableSpace[1][5] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 5) }}> </td>
                                <td className={availableSpace[1][6] === 1 ? 'available' : availableSpace[1][6] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 6) }}> </td>
                                <td className={availableSpace[1][7] === 1 ? 'available' : availableSpace[1][7] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 7) }}> </td>
                                <td className={availableSpace[1][8] === 1 ? 'available' : availableSpace[1][8] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 8) }}> </td>
                                <td className={availableSpace[1][9] === 1 ? 'available' : availableSpace[1][9] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(1, 9) }}> </td>
                                <td></td>
                            </tr>
                            <tr className={startDate.getDay() === 3 ? 'active-day' : '03'}>
                                <td className={availableSpace[2][0] === 1 ? 'available' : availableSpace[2][0] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 0) }}> </td>
                                <td className={availableSpace[2][1] === 1 ? 'available' : availableSpace[2][1] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 1) }}> </td>
                                <td className={availableSpace[2][2] === 1 ? 'available' : availableSpace[2][2] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 2) }}> </td>
                                <td className={availableSpace[2][3] === 1 ? 'available' : availableSpace[2][3] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 3) }}> </td>
                                <td className={availableSpace[2][4] === 1 ? 'available' : availableSpace[2][4] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 4) }}> </td>
                                <td className={availableSpace[2][5] === 1 ? 'available' : availableSpace[2][5] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 5) }}> </td>
                                <td className={availableSpace[2][6] === 1 ? 'available' : availableSpace[2][6] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 6) }}> </td>
                                <td className={availableSpace[2][7] === 1 ? 'available' : availableSpace[2][7] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 7) }}> </td>
                                <td className={availableSpace[2][8] === 1 ? 'available' : availableSpace[2][8] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 8) }}> </td>
                                <td className={availableSpace[2][9] === 1 ? 'available' : availableSpace[2][9] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(2, 9) }}> </td>
                                <td></td>
                            </tr>
                            <tr className={startDate.getDay() === 4 ? 'active-day' : '04'}>
                                <td className={availableSpace[3][0] === 1 ? 'available' : availableSpace[3][0] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 0) }}> </td>
                                <td className={availableSpace[3][1] === 1 ? 'available' : availableSpace[3][1] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 1) }}> </td>
                                <td className={availableSpace[3][2] === 1 ? 'available' : availableSpace[3][2] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 2) }}> </td>
                                <td className={availableSpace[3][3] === 1 ? 'available' : availableSpace[3][3] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 3) }}> </td>
                                <td className={availableSpace[3][4] === 1 ? 'available' : availableSpace[3][4] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 4) }}> </td>
                                <td className={availableSpace[3][5] === 1 ? 'available' : availableSpace[3][5] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 5) }}> </td>
                                <td className={availableSpace[3][6] === 1 ? 'available' : availableSpace[3][6] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 6) }}> </td>
                                <td className={availableSpace[3][7] === 1 ? 'available' : availableSpace[3][7] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 7) }}> </td>
                                <td className={availableSpace[3][8] === 1 ? 'available' : availableSpace[3][8] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 8) }}> </td>
                                <td className={availableSpace[3][9] === 1 ? 'available' : availableSpace[3][9] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(3, 9) }}> </td>
                                <td></td>
                            </tr>
                            <tr className={startDate.getDay() === 5 ? 'active-day' : '05'}>
                                <td className={availableSpace[4][0] === 1 ? 'available' : availableSpace[4][0] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 0) }}> </td>
                                <td className={availableSpace[4][1] === 1 ? 'available' : availableSpace[4][1] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 1) }}> </td>
                                <td className={availableSpace[4][2] === 1 ? 'available' : availableSpace[4][2] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 2) }}> </td>
                                <td className={availableSpace[4][3] === 1 ? 'available' : availableSpace[4][3] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 3) }}> </td>
                                <td className={availableSpace[4][4] === 1 ? 'available' : availableSpace[4][4] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 4) }}> </td>
                                <td className={availableSpace[4][5] === 1 ? 'available' : availableSpace[4][5] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 5) }}> </td>
                                <td className={availableSpace[4][6] === 1 ? 'available' : availableSpace[4][6] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 6) }}> </td>
                                <td className={availableSpace[4][7] === 1 ? 'available' : availableSpace[4][7] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 7) }}> </td>
                                <td className={availableSpace[4][8] === 1 ? 'available' : availableSpace[4][8] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 8) }}> </td>
                                <td className={availableSpace[4][9] === 1 ? 'available' : availableSpace[4][9] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(4, 9) }}> </td>
                                <td></td>
                            </tr>
                            <tr className={startDate.getDay() === 6 ? 'active-day' : '06'}>
                                <td className={availableSpace[5][0] === 1 ? 'available' : availableSpace[5][0] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 0) }}> </td>
                                <td className={availableSpace[5][1] === 1 ? 'available' : availableSpace[5][1] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 1) }}> </td>
                                <td className={availableSpace[5][2] === 1 ? 'available' : availableSpace[5][2] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 2) }}> </td>
                                <td className={availableSpace[5][3] === 1 ? 'available' : availableSpace[5][3] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 3) }}> </td>
                                <td className={availableSpace[5][4] === 1 ? 'available' : availableSpace[5][4] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 4) }}> </td>
                                <td className={availableSpace[5][5] === 1 ? 'available' : availableSpace[5][5] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 5) }}> </td>
                                <td className={availableSpace[5][6] === 1 ? 'available' : availableSpace[5][6] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 6) }}> </td>
                                <td className={availableSpace[5][7] === 1 ? 'available' : availableSpace[5][7] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 7) }}> </td>
                                <td className={availableSpace[5][8] === 1 ? 'available' : availableSpace[5][8] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 8) }}> </td>
                                <td className={availableSpace[5][9] === 1 ? 'available' : availableSpace[5][9] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(5, 9) }}> </td>
                                <td></td>
                            </tr>
                            <tr className={startDate.getDay() === 0 ? 'active-day' : '07'}>
                                <td className={availableSpace[6][0] === 1 ? 'available' : availableSpace[6][0] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 0) }}> </td>
                                <td className={availableSpace[6][1] === 1 ? 'available' : availableSpace[6][1] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 1) }}> </td>
                                <td className={availableSpace[6][2] === 1 ? 'available' : availableSpace[6][2] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 2) }}> </td>
                                <td className={availableSpace[6][3] === 1 ? 'available' : availableSpace[6][3] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 3) }}> </td>
                                <td className={availableSpace[6][4] === 1 ? 'available' : availableSpace[6][4] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 4) }}> </td>
                                <td className={availableSpace[6][5] === 1 ? 'available' : availableSpace[6][5] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 5) }}> </td>
                                <td className={availableSpace[6][6] === 1 ? 'available' : availableSpace[6][6] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 6) }}> </td>
                                <td className={availableSpace[6][7] === 1 ? 'available' : availableSpace[6][7] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 7) }}> </td>
                                <td className={availableSpace[6][8] === 1 ? 'available' : availableSpace[6][8] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 8) }}> </td>
                                <td className={availableSpace[6][9] === 1 ? 'available' : availableSpace[6][9] === 0 ? 'unavailable' : 'booking'} onClick={() => { handleBooking(6, 9) }}> </td>
                                <td></td>
                            </tr>

                        </tbody>

                    </table>
                </div>
                <div className="hints">
                    <div className="hint-1">
                        <div className="green-box">

                        </div>
                        Available
                    </div>
                    <div className="hint-2">
                        <div className="blue-box">

                        </div>
                        Your Booking
                    </div>

                    <div className="hint-3">
                        <div className="gray-box"></div>
                        Unavailable
                    </div>
                </div>
            </div>
            <hr className='hr-line' />
            {booking && <div className="selected-appt">
                <div className="show-appt">

                    <p><strong className='str'>Doctor: </strong> {data.user.firstname + " " + data.user.lastname}</p>
                    <p><strong className='str'>Branch: </strong> {data.specialization}</p>
                    <p><strong className='str'> From:</strong> {formatDate(findBookedDate(), 2)}</p>
                    <p><strong className='str' style={{ marginRight: "2.5rem" }}>To: </strong> {formatDate(getDateOneHourLater(findBookedDate()), 2)}</p>
                    <div className="buttons">
                        <Button variant="contained" style={{ marginRight: ".5rem" }} onClick={handleApprove} >Approve</Button>
                        <Button variant="outlined" onClick={handleCancel} >Cancel</Button>
                    </div>
                </div>

            </div>}


        </div>}

        <ToastContainer />

    </>
}