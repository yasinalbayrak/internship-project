import React from "react";
import "./popUp.css";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
function PopUp({title,text,popUp, action,actionParams, setActionParams }) {
  
  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>{title}</h2>
        <p>{text}</p>
        <Button className="cl" variant="outlined" onClick={()=>{
            popUp();
            setActionParams(null);
        }}>No</Button>
        <Button className="sc" startIcon={<DeleteIcon />} variant="contained" color="error" onClick={()=>{
            popUp();
            action(actionParams);
            setActionParams(null);
        }}>
        Cancel
      </Button>
      </div>
      
    </div>
  );
}

export default PopUp;