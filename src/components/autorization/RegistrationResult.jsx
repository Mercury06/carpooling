import React from "react";
import {NavLink} from "react-router-dom";
import "./authorization.css";


const RegistrationResult = () => {   
    

    return (
        <div className='result'>
        
           <div>
                <h3>Registration completed successfully!</h3>
                <center><h3>You can&nbsp;<NavLink to="/login">login</NavLink> now</h3></center>
           </div>
                
        </div>
    );
};

export default RegistrationResult;