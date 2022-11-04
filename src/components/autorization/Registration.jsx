import React, { useState } from 'react';
import { registration } from '../api/actions';
//import Input from "/code/use/cloud_storage_app/client/src/utils/input/Input";
import './authorization.css';
import { Navigate } from 'react-router-dom';

const Registration = () => {
  //const[form, setForm] = useState({ username: "", password: "" })
  const [form, setForm] = useState({ username: '', password: '' });
  const [response, setResponse] = useState('');

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    //console.log(form)
  };

  return (
    <div className="authorization">
      <div className="authorization__header">
        <h4>Registration</h4>
      </div>
      <input
        onChange={changeHandler}
        type="text"
        name="username"
        placeholder="Enter your login"
        autoFocus="autofocus"
      />
      <br></br>
      <input onChange={changeHandler} type="password" name="password" placeholder="Password" />{' '}
      <br></br>
      <button className="authorization__btn" onClick={() => registration({ ...form }, setResponse)}>
        Submit
      </button>
      {response && <Navigate to="/result" replace />}
    </div>
  );
};

export default Registration;
