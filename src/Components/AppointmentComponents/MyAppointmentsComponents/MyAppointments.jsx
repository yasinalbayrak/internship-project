import React, { useEffect, useState } from 'react';
import './MyAppointments.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { fetchData } from '../../../service/apiService';

export default function MyAppointments() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const userIDStr = JSON.parse(localStorage.getItem("userID"))
    useEffect(() => {

        const fetchDataFromApi = async () => {
            try {
                const url = `/api/v1/appointment/user/${userIDStr}`;
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
    }, [userIDStr]);
    function handleRemove(id)  {
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
                const filteredData = data.map((each)=>{
                    if(each.id === id){
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
    return <>

        <div className="appointment-outer-container">

            <div className="appointment-container">
                <table>
                    <tr className="header">
                        <th>Doctor</th>
                        <th>Contact</th>
                        <th>Gender</th>
                        <th>Specialization</th>
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
                                    <td>Dr. {eachApp.doctor.user.firstname} {eachApp.doctor.user.lastname}</td>
                                    <td>{eachApp.doctor.user.email}</td>
                                    <td>{eachApp.doctor.user.gender.charAt(0) + eachApp.doctor.user.gender.slice(1).toLowerCase()}</td>
                                    <td>{eachApp.doctor.specialization}</td>
                                    <td>{datePart}</td>
                                    <td>{formattedTime}-{formattedTimeOneHourLater}</td>
                                    <td className="app-status">
                                        <div className={`st-${eachApp.status.toLowerCase()}`}>
                                            {eachApp.status}
                                        </div>
                                    </td>
                                    <td className="last-col-cell">
                                        <div className="icon-container">
                                            {eachApp.status === "ACTIVE" && <FontAwesomeIcon onClick={()=>{handleRemove(eachApp.id)}} icon={faTimes} className="red-bold-icon" />}    
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>


                </table >


            </div >

        </div >

    </>
}