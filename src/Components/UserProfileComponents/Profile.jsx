import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import "./Profile.css"
import { useNavigate } from "react-router-dom";
import { fetchData } from '../../service/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PersonalProfile() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const userIDStr = JSON.parse(localStorage.getItem("userID"))
    const [editMode, setEditMode] = useState(false);
    const [email, setEmail] = useState("")
    const [age, setAge] = useState(null)
    const [gender, setGender] = useState("")

    const handleEditToggle = () => {
        setEditMode(!editMode); // Toggle edit mode
    };

    const handleAgeChange = (event) => {
        setAge(event.target.value)
    }


    const handleUpdate = async () => {
        try {
            // Send update request to the server
            console.log(userIDStr)
            const url = `/api/v1/user/patient/${userIDStr}`;
            const options = {
                method: 'PUT',
                headers: {
                    //"Authorization": Cookies.get("token")
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({

                    "firstname": data.firstname,
                    "lastname": data.lastname,
                    "email": email,
                    "gender": gender,
                    "age":parseInt(age)

                })

            }
            // Send update request to the server and get the updated data
            const updatedData = await fetchData(url, options);

            // Create promises for all state-setting operations
            const setEmailPromise = setEmail(updatedData.email);
            const setAgePromise = setAge(parseInt(updatedData.age));
            const setGenderPromise = setGender(updatedData.gender);

            // Wait for all promises to resolve before updating the main data and exiting edit mode
            await Promise.all([setEmailPromise, setAgePromise, setGenderPromise]);

            // Update the component's state with the new data
            setData(updatedData);

            // Exit edit mode
            setEditMode(prev => !prev);
            toast.info("Informations are updated.")
        } catch (error) {
            // Handle error if update fails
        }
    };

    const handleLogout = () => {


        const logout = async () => {
            const url = "http://localhost:8080/api/v1/auth/logout"
            const options = {
                method: 'POST',
                headers: {
                    //"Authorization": Cookies.get("token")
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
                        //"Authorization": Cookies.get("token")
                    },

                };

                const fetchedData = await fetchData(url, options);
                setData(fetchedData);


                setAge(parseInt(fetchedData.age))
                setEmail(fetchedData.email)
                setGender(fetchedData.gender)
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
    const handleAddAppointments = () => {
        navigate("/BookAppointments")

    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };
    // Render different UI based on loading and error states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Server currently is not responding.</div>;
    }
    return (
        <>
        <section className="vh-100 profile" style={{}}>

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
                                        <MDBRow>
                                            <MDBCol>
                                                <MDBTypography tag="h6" style={{ height: "2.5rem" }}>Information</MDBTypography>
                                            </MDBCol>
                                            <MDBCol>
                                                {
                                                    !editMode ?
                                                        <Button onClick={() => { setEditMode((prev) => !prev) }} endIcon={<EditIcon />} variant="outlined" color="error" style={{ position: "absolute", right: "20px" }}> Edit </Button>
                                                        :
                                                        <>
                                                            <Button onClick={handleUpdate} startIcon={<DoneOutlineIcon />} variant="contained" color="success" style={{ position: "absolute", right: "20px" }}> Update</Button>
                                                            <Button onClick={() => {
                                                                setEmail(data.email)
                                                                setAge(parseInt(data.age))
                                                                setGender(data.gender)
                                                                setEditMode((prev) => !prev)
                                                            }} variant="outlined" color="error" style={{ position: "absolute", right: "140px" }}> Cancel </Button>

                                                        </>

                                                }

                                            </MDBCol>

                                        </MDBRow>

                                        <hr className="mt-0 mb-4" />
                                        <MDBRow className="pt-1">
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Email</MDBTypography>
                                                {editMode ?
                                                    <input
                                                        type="email"
                                                        id="inputEmail"
                                                        className="form-control form-control-lg"
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                        disabled={loading}

                                                    />
                                                    :
                                                    <MDBCardText className="text-muted">{data.email}</MDBCardText>}
                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">id</MDBTypography>
                                                <MDBCardText className="text-muted">{data.id}</MDBCardText>
                                            </MDBCol>
                                        </MDBRow>

                                        <MDBRow className="pt-1">
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Age</MDBTypography>
                                                {
                                                    !editMode ?
                                                        <MDBCardText className="text-muted">{data.age}</MDBCardText>
                                                        :
                                                        <input
                                                            type="number"
                                                            id="inputAge"
                                                            className="form-control form-control-lg"

                                                            value={age}
                                                            onChange={handleAgeChange}
                                                            disabled={loading}

                                                        />}

                                            </MDBCol>
                                            <MDBCol size="6" className="mb-3">
                                                <MDBTypography tag="h6">Gender</MDBTypography>
                                                {
                                                    !editMode ?


                                                        <MDBCardText className="text-muted">{(data.gender)}</MDBCardText>
                                                        :
                                                        <div className="form-outline mb-4 form-group custom-radio">
                                                            <div class="radio-input" style={{ width: "220px", left: "0" }}>
                                                                <input value="FEMALE"
                                                                    name="gender-radio"
                                                                    id="female"
                                                                    type="radio"
                                                                    className="input i_female"
                                                                    onChange={handleGenderChange} // Add onChange event handler
                                                                    checked={gender === 'FEMALE'}

                                                                />

                                                                <input
                                                                    value="MALE"
                                                                    name="gender-radio"
                                                                    id="male"
                                                                    type="radio"
                                                                    className="input i_male"
                                                                    onChange={handleGenderChange} // Add onChange event handler
                                                                    checked={gender === 'MALE'}
                                                                />
                                                                <div class="card female">
                                                                    <svg class="logo" width="48" height="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M12 15.75A7.125 7.125 0 1 0 12 1.5a7.125 7.125 0 0 0 0 14.25Z"></path>
                                                                        <path d="M12 15.75v6.75"></path>
                                                                        <path d="M14.719 19.5H9.28"></path>
                                                                    </svg>
                                                                    <div class="title">Female</div>
                                                                </div>

                                                                <div class="card male">
                                                                    <svg class="logo" width="48" height="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10.125 21a7.125 7.125 0 1 0 0-14.25 7.125 7.125 0 0 0 0 14.25Z"></path>
                                                                        <path d="M21 7.5V3h-4.5"></path>
                                                                        <path d="M15.188 8.813 21 3"></path>
                                                                    </svg>
                                                                    <div class="title">Male</div>
                                                                </div>

                                                            </div>

                                                        </div>
                                                }
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
        <ToastContainer />
        </>
    );
}