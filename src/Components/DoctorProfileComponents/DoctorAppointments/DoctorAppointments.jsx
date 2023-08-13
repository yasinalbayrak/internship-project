import React, { useEffect, useState } from 'react';
import './DoctorAppointments.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { fetchData } from '../../../service/apiService';
import PopUp from '../../PopUp/popUp';

export default function DoctorAppointments() {
    // ALert Dialog
    const [alert, setAlert] = React.useState({
        type: 'error',
        text: 'This is a alert message',
        show: false
    })

    const [showPopUp,setShowPopUp] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [appToCancel, setAppToCancel] = useState(null);

    const navigate = useNavigate();
    const userIDStr = JSON.parse(localStorage.getItem("userID"));


    function togglePopUp(){
        setShowPopUp( (p) => !p );
        console.log(showPopUp)
       
      }
    useEffect(() => {

        const fetchDataFromApi = async () => {
            try {
                const url = `/api/v1/appointment/doctor/${userIDStr}`;
                const options = {
                    method: 'GET',
                    headers: {
                        //"Authorization": Cookies.get("token")
                    }
                };

                const fetchedData = await fetchData(url, options);
                setData(fetchedData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDataFromApi();
    }, []);
    function handleRemove(id) {
        const fetchDataFromApi = async () => {
            try {
                const url = `/api/v1/appointment/${id}`;
                const options = {
                    method: 'POST',
                    headers: {
                        //"Authorization": Cookies.get("token")
                    }
                };

                await fetchData(url, options);
                const filteredData = data.map((each) => {
                    if (each.id === id) {
                        each.status = "CANCELLED"
                    }
                    return each
                })

                setData(filteredData);

            } catch (error) {
                setError(error.message);

            }
        };
        fetchDataFromApi();


    }

    function onCloseAlert() {
        setAlert({
            type: '',
            text: '',
            show: false
        })
    }
    function onShowAlert(type) {
        setAlert({
            type: type,
            text: 'Are you sure to cancel this appointment',
            show: true
        })
    }

    return <>

        <div className="appointment-outer-container">
            <div className="appointment-container">
                <div className="back-bt">
                    <button onClick={()=>{navigate("/DoctorProfile")}}>
                        <div class="arrow-wrapper">
                            <div class="arrow"></div>
                        </div>
                        Profile
                    </button>
                </div>
                


                <div className="app-title">
                    Appointments

                </div>
                <table>
                    <tr className="header">
                        <th>Patient</th>
                        <th>Contact</th>
                        <th>Gender</th>
                       
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th className="last-child"></th>
                    </tr>
                    <tbody>
                        {data && data.map((eachApp) => {
                            const [datePart, timePart] = eachApp.date.split('T');
                            const originalTime = new Date(`${datePart}T${timePart}`);
                            const formattedTime = `${String(originalTime.getHours()).padStart(2, '0')}:${String(originalTime.getMinutes()).padStart(2, '0')}`;
                            const oneHourLater = new Date(originalTime.getTime() + (60 * 60 * 1000));
                            const formattedTimeOneHourLater = `${String(oneHourLater.getHours()).padStart(2, '0')}:${String(oneHourLater.getMinutes()).padStart(2, '0')}`;

                            return (
                                <tr key={eachApp.id}>
                                    <td>{eachApp.patient.firstname} {eachApp.patient.lastname}</td>
                                    <td>{eachApp.patient.email}</td>
                                    <td>{eachApp.patient.gender.charAt(0) + eachApp.patient.gender.slice(1).toLowerCase()}</td>
                                    
                                    <td>{datePart}</td>
                                    <td>{formattedTime}-{formattedTimeOneHourLater}</td>
                                    <td className="app-status">
                                        <div className={`st-${eachApp.status.toLowerCase()}`}>
                                            {eachApp.status}
                                        </div>
                                    </td>
                                    <td className="last-col-cell">
                                        <div className="icon-container">
                                            {eachApp.status === "ACTIVE" && <FontAwesomeIcon
                                                //onClick={() => { handleRemove(eachApp.id) }} 
                                                onClick={()=>{
                                                    togglePopUp()
                                                    setAppToCancel(eachApp.id)
                                                }}

                                                icon={faTimes}
                                                className="red-bold-icon" />}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>


                </table >


            </div >

        </div >
        {showPopUp && <PopUp
          title = "Warning"
          text="Are you sure to cancel this appointment?"
          popUp = {togglePopUp}
          action = {handleRemove}
          actionParams= {appToCancel}
          setActionParams = {setAppToCancel}
          
          />}
    </>
}