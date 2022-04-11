import React, { useState} from "react";
import { useDispatch } from "react-redux";
import { login } from "./../../actions/users";
import {NavLink} from "react-router-dom";
import "./authorization.css";



const Login = () => {
   
    const[form, setForm] = useState({ email: "", password: "" })
    const[response, setResponse] = useState('')        
   
    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }
    const dispatch = useDispatch();   

    return (
        <div className='authorization'>
        
            <div className='authorization__header'><h4>Login</h4></div>            
           
                <input onChange={changeHandler} type="text" name="email" placeholder="Username" autoFocus="autofocus"/><br></br>
         
                <input  onChange={changeHandler} type="password" name="password" placeholder="Password" />  <br></br>       
          
                <button className="authorization__btn" onClick={() => dispatch(login({...form}, setResponse))}>Sign in</button>
                { response && <div className="authorization_response">{response}</div>} 
                <div><NavLink to="/registration">Don`t have an account? Register</NavLink></div>
        </div>
    );
};

export default Login;