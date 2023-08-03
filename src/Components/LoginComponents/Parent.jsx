import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import Login from './Login';
import AuthActionTypes from './type';

export function Parent({type}) {
    const [loginType, setLoginType] = useState(type ? type:AuthActionTypes.LOGIN );
  
    const handleSignUpLinkClick = () => {
      // Toggle between login and signup types
      setLoginType((prevType) =>
        prevType === AuthActionTypes.LOGIN ? AuthActionTypes.SIGNUP : AuthActionTypes.LOGIN
      );
    };
  
    return (
        <Login type={loginType}
              handleSignUpLinkClick = {handleSignUpLinkClick}
        />  
      
    );
  }