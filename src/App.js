
import './App.css';
import React from 'react';
import { BrowserRouter, Routes,Route } from "react-router-dom";

import Login from './Components/LoginComponents/Login';
import AuthActionTypes from './Components/LoginComponents/type';
import { Parent } from './Components/LoginComponents/Parent';
import Profile from "./Components/UserProfileComponents/Profile"
import './globalVariables';

function App() {
  return <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Parent type={AuthActionTypes.SIGNUP}/>} />
      <Route path="/profile" element={<Profile />} />
      
    </Routes>
  </BrowserRouter>
}

export default App;
