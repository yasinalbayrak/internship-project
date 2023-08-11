import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import "./Profile.css"
import { useNavigate } from "react-router-dom";
import { fetchData } from '../../service/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
export default function PersonalProfile() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const userIDStr = JSON.parse(localStorage.getItem("userID"))
    const handleLogout = () => {


        const logout = async () => {
            const url = "http://localhost:8080/api/v1/auth/logout"
            const options = {
                method: 'POST',
                headers: {
                    "Authorization": Cookies.get("token")
                }
            }
            const fetchedData = await fetchData(url, options);

        }
        localStorage.removeItem("userID")
        Cookies.remove("token")
        navigate("/")
    }

    useEffect(() => {

        const fetchDataFromApi = async () => {
            try {
                const url = `/api/v1/user/patient/${userIDStr}`;
                const options = {
                    method: 'GET',
                    headers: {
                        "Authorization": Cookies.get("token")
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

    const handleMyAppointments = () => {
        navigate("/myAppointments")
        
    }
    const  handleAddAppointments = () => {
        navigate("/BookAppointments")
        
    }
   

    // Render different UI based on loading and error states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Server currently is not responding.</div>;
    }
    return (
        <section className="vh-100 profile" style={{  }}>

            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="8" className="mb-4 mb-lg-0">
                        <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                            <MDBRow className="g-0">
                                <MDBCol md="4" className="gradient-custom text-center text-white"
                                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                    <MDBCardImage src={data.gender === "MALE" ? "https://cdn3.iconfinder.com/data/icons/urology-1/60/patient__avatar__man__male__boy-512.png" : "https://cdn0.iconfinder.com/data/icons/doctors-specialist-1/60/patient__female__girl__medical__avatar-512.png"}
                                        alt="Avatar" className="my-5" style={{ width: '100px' }} fluid />
                                    <MDBTypography tag="h5">{data.firstname + " " + data.lastname}</MDBTypography>
                                    <MDBCardText>{data.role}</MDBCardText>
                                    <MDBIcon far icon="edit mb-5" />
                                </MDBCol>

                                <MDBCol className='my-column' md="8">
                                    <button class="my-Btn" onClick={handleLogout}>

                                        <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

                                        <div class="text">Logout</div>
                                    </button>
                                    <MDBCardBody className="p-4">

                                        <MDBTypography tag="h6">Information</MDBTypography>

                                        <hr className="mt-0 mb-4" />
                                        <MDBRow className="pt-1">
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Email</MDBTypography>
                                                <MDBCardText className="text-muted">{data.email}</MDBCardText>
                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">id</MDBTypography>
                                                <MDBCardText className="text-muted">{data.id}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>

                                        <MDBRow className="pt-1">
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Age</MDBTypography>
                                                <MDBCardText className="text-muted">{data.age}</MDBCardText>
                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Gender</MDBTypography>
                                                <MDBCardText className="text-muted">{(data.gender)}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>
                                        <br />
                                        <MDBTypography tag="h6">Actions</MDBTypography>
                                        <hr className="mt-0 mb-4" />
                                        <MDBRow className="pt-1">
                                            <MDBCol size="6" className="mb-3 mine">
                                                <button type="button" class="button" onClick={handleMyAppointments}>
                                                    <span class="button__text">My Appointments</span>
                                                    <span class="button__icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                                </button>
                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">

                                                <button type="button" class="button" onClick={handleAddAppointments}>
                                                    <span class="button__text">Book Appointments</span>
                                                    <span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
                                                </button>
                                            </MDBCol>
                                        </MDBRow>

                                        <div className="d-flex justify-content-start">

                                        </div>
                                    </MDBCardBody>
                                </MDBCol>
                            </MDBRow>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}