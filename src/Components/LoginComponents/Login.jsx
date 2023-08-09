import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css"
import AuthActionTypes from "./type";
import { fetchData } from '../../service/apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

export default function Login({ type, handleSignUpLinkClick }) {

    const [data, setData] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState('');


    const [nameClicked, setNameClicked] = useState(false);
    const [emailClicked, setEmailClicked] = useState(false);
    const [firstNameClicked, setFirstNameClicked] = useState(false);
    const [lastNameClicked, setLastNameClicked] = useState(false);
    const [ageClicked, setAgeClicked] = useState(false);
    

    const [loading, setLoading] = useState(false); // State for loading state
    const navigate = useNavigate();

    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    var user;

    async function fetchDataFromApi(type) {
        try {
            
            user = type === 1 ? {
                "firstname": firstName,
                "lastname": lastName,
                "email": email,
                "password": name,
                "age": age,
                "gender": gender
            }
                :
                {
                    "email": email,
                    "password": name
                }

            
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify(user),


            }
            const apiData = await fetchData(
                type === 1 ? window.SIGNUP : window.LOGIN,
                options
            );

            // Check if the API response has an "error" property
            if (apiData.error) {
                const errorMessage = apiData.message || "Unknown error";
                notify("Error: " + apiData.error + ", " + errorMessage);
            } else {


                const decodedToken = jwtDecode(apiData.token);
                console.log("Yasiiiiiiinnn")
                Cookies.set('token', "Bearer " + apiData.token, {
                    expires: new Date(decodedToken.exp * 1000), // Convert exp timestamp to milliseconds
                    path: '/', // Specify the path where the cookie is accessible
                    secure: true, // Set the Secure flag to ensure the cookie is only sent over HTTPS
                    sameSite: 'lax', // Adjust this based on your needs (e.g., 'strict' or 'none' for cross-site requests)
                    //httpOnly: true, // Set the HttpOnly flag to prevent JavaScript access to the cookie
                });

                localStorage.setItem('userID', JSON.stringify(apiData.id));
                navigate("/Profile")

            }

            setLoading(false);
        } catch (error) {
            // Handle specific HTTP error status codes
            if (error.response) {
                // Extract and display the error message from the API response
                const responseData = await error.response.json();
                const errorMessage = responseData.message || "Unknown error";
                notify("Error: " + error.response.statusText + ", " + errorMessage);
            } else {
                // Handle other errors
                console.log(error);
                notify("Error: " + error.message);
            }

            setLoading(false);
        }
    }
    const handleLogin = () => {
        if (email === "" || name === "" || (type === AuthActionTypes.SIGNUP && (firstName === "" || lastName === "" || age === null || gender === ""))) {
            notify("Missing Information, fill out the form.")
            return
        }

        // Simulate API request (replace this with your actual API call)
        setLoading(true);
        if (type === AuthActionTypes.SIGNUP) {
            fetchDataFromApi(1)
        } else {
            fetchDataFromApi(2)
        }

    }


    const notify = (message) => toast.error(message);

    const handleLinkClick = () => {


        setEmail("")
        setFirstName("")
        setLastName("")
        setName("")
        setAge("")
        setGender("")

        handleSignUpLinkClick()
    }

    return (
        <>
            <section className="main" >
                <div className="container py-5">
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                                <div className="card-body p-5 text-center">

                                    <h3 className="mb-5 login-title">{type}</h3>
                                    {type === AuthActionTypes.SIGNUP && <><div className="form-outline mb-4 form-group">
                                        <label className={`form-label ${firstNameClicked || firstName ? 'active' : ''}`} htmlFor="inputName">
                                            First Name:
                                        </label>
                                        <input type="text"
                                            id="inputName"
                                            className="form-control form-control-lg"
                                            onFocus={() => { setFirstNameClicked(true) }}
                                            onBlur={() => { setFirstNameClicked(false) }}
                                            value={firstName}
                                            onChange={handleFirstNameChange}
                                            disabled={loading}
                                            required={true}
                                        //autoComplete={false}
                                        />

                                    </div>
                                        <div className="form-outline mb-4 form-group">
                                            <label className={`form-label ${lastNameClicked || lastName ? 'active' : ''}`} htmlFor="inputLName">
                                                Last Name:
                                            </label>
                                            <input type="text"
                                                id="inputLName"
                                                className="form-control form-control-lg"
                                                onFocus={() => { setLastNameClicked(true) }}
                                                onBlur={() => { setLastNameClicked(false) }}
                                                value={lastName}
                                                onChange={handleLastNameChange}
                                                disabled={loading}
                                                required={true}
                                            />

                                        </div></>}
                                    <div className="form-outline mb-4 form-group">
                                        <label className={`form-label ${emailClicked || email ? 'active' : ''}`} htmlFor="inputEmail">
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            id="inputEmail"
                                            className="form-control form-control-lg"
                                            onFocus={() => { setEmailClicked(true) }}
                                            onBlur={() => { setEmailClicked(false) }}
                                            value={email}
                                            onChange={handleEmailChange}
                                            disabled={loading}
                                            required={true}
                                        />

                                    </div>

                                    <div className="form-outline mb-4 form-group">
                                        <label className={`form-label ${nameClicked || name ? 'active' : ''}`} htmlFor="inputName">
                                            Password:
                                        </label>
                                        <input type="password"
                                            id="inputName"
                                            className="form-control form-control-lg"
                                            onFocus={() => { setNameClicked(true) }}
                                            onBlur={() => { setNameClicked(false) }}
                                            value={name}
                                            onChange={handleNameChange}
                                            disabled={loading}
                                            required={true}
                                        />

                                    </div>

                                    {type === AuthActionTypes.SIGNUP &&
                                    <>
                                    <div className="form-outline mb-4 form-group">
                                        <label className={`form-label ${ageClicked || age ? 'active' : ''}`} htmlFor="inputAge">
                                            Age:
                                        </label>
                                        <input
                                            type="number"
                                            id="inputAge"
                                            className="form-control form-control-lg"
                                            onFocus={() => { setAgeClicked(true) }}
                                            onBlur={() => { setAgeClicked(false) }}
                                            value={age}
                                            onChange={handleAgeChange}
                                            disabled={loading}
                                            required={true}
                                        />

                                    </div>


                                    <div className="form-outline mb-4 form-group custom-radio">
                                        <div class="radio-input">
                                            <input value="FEMALE" 
                                                name="gender-radio"
                                                id="female"
                                                type="radio"
                                                className="input i_female"
                                                onChange={handleGenderChange} // Add onChange event handler
                                            />

                                            <input
                                                value="MALE" 
                                                name="gender-radio"
                                                id="male"
                                                type="radio"
                                                className="input i_male"
                                                onChange={handleGenderChange} // Add onChange event handler
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
                                    </>
                                    }

                                    <button disabled={loading} className="btn btn-primary btn-lg btn-block col-12" type="submit" onClick={handleLogin}>
                                        {loading ? 'Loading...' : type}
                                    </button>

                                    <hr className="my-4" />

                                    {!loading && <a href="#" onClick={handleLinkClick}>
                                        {type === AuthActionTypes.LOGIN ? "Don't have an account? Sign up" : 'Have an account? Sign in'}
                                    </a>}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </section>


        </>
    );
}