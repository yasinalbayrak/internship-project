

import React, { useEffect, useState } from 'react';
import './BookAppointments.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate,useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { fetchData } from '../../../service/apiService';
import PopUp from '../../PopUp/popUp';

export default function BookAppointments() {
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
                const url = `/api/v1/user/doctor`;
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

    function handleDoctorPage(id){
        if(id){
            navigate(`/doctorAvailableSpaces?id=${id}`)
        }
        else{
            //TODO handle error occurs
        }
    }

    return <>

        <div className="appointment-outer-container">
            <div className="doctor-container">
                <div className="back-bt">
                    <button onClick={()=>{navigate("/Profile")}}>
                        <div class="arrow-wrapper">
                            <div class="arrow"></div>
                        </div>
                        Profile
                    </button>
                </div>
                <div className="forward-bt">
                    <button onClick={()=>{navigate("/MyAppointments")}}>
                        My Appointments
                        <div class="arrow-wrapper">
                            <div class="arrow"></div>

                        </div>
                    </button>

                </div>


                <div className="app-title">
                    Doctors
                    
                </div>
                <p> Select a doctor for appointment</p>
                <table>
                    <tr className="header">
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Specialization</th>
                        
                        
                    </tr>
                    <tbody>
                        {data && data.map((eachApp) => {
                           
                            return (
                                <tr key={eachApp.id} onClick={()=>handleDoctorPage(eachApp.user.id)}>
                                    <td>{eachApp.user.firstname} </td>
                                    <td>{eachApp.user.lastname}</td>
                                    <td>{eachApp.user.email}</td>
                                    <td>{eachApp.user.gender}</td>
                                    <td>{eachApp.user.age}</td>
                                    <td>{eachApp.specialization}</td>
                                    
                                    
                                </tr>
                            );
                        })}
                    </tbody>


                </table >


            </div >

        </div >
        
    </>
}
