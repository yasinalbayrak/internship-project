import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import "./Profile.css"
import { fetchData } from '../../service/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
export default function PersonalProfile() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const userIDStr = JSON.parse(localStorage.getItem("userID"))


    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const url = `/api/v1/user/patient/${userIDStr}`;
                const options = {
                    method: 'GET',
                    // Add any necessary headers or authentication information here
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
    // Render different UI based on loading and error states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <section className="vh-100 profile" style={{ backgroundColor: '#f4f5f7' }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol lg="8" className="mb-4 mb-lg-0">
                        <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                            <MDBRow className="g-0">
                                <MDBCol md="4" className="gradient-custom text-center text-white"
                                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                    <MDBCardImage src="https://cdn3.iconfinder.com/data/icons/urology-1/60/patient__avatar__man__male__boy-512.png"
                                        alt="Avatar" className="my-5" style={{ width: '100px' }} fluid />
                                    <MDBTypography tag="h5">{data.firstname + " " + data.lastname}</MDBTypography>
                                    <MDBCardText>{data.role}</MDBCardText>
                                    <MDBIcon far icon="edit mb-5" />
                                </MDBCol>
                                <MDBCol md="8">
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
                                        <br />
                                        <MDBTypography tag="h6">Actions</MDBTypography>
                                        <hr className="mt-0 mb-4" />
                                        <MDBRow className="pt-1">
                                            <MDBCol size="6" className="mb-3 mine">
                                                <button type="button" class="button">
                                                    <span class="button__text">My Appointments</span>
                                                    <span class="button__icon"><FontAwesomeIcon icon={faCalendar} /></span>
                                                </button>
                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">

                                                <button type="button" class="button">
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