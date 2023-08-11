
import './App.css';
import React from 'react';
import { BrowserRouter, Routes,Route } from "react-router-dom";

import Login from './Components/LoginComponents/Login';
import AuthActionTypes from './Components/LoginComponents/type';
import { Parent } from './Components/LoginComponents/Parent';
import Profile from "./Components/UserProfileComponents/Profile"
import './globalVariables';
import MyAppointments from './Components/AppointmentComponents/MyAppointmentsComponents/MyAppointments';
import BookAppointments from './Components/AppointmentComponents/BookAppointmentComponents/BookAppointments';
import DoctorAvailableSpaces from './Components/AppointmentComponents/BookAppointmentComponents/DoctorAvailableSpaces/DoctorAvailableSpaces';
function App() {
  return <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Parent type={AuthActionTypes.SIGNUP}/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/myAppointments" element={<MyAppointments />} />
      <Route path="/bookAppointments" element={<BookAppointments />} />
      <Route path="/doctorAvailableSpaces" element={<DoctorAvailableSpaces />} />
    </Routes>
  </BrowserRouter>
}

export default App;
