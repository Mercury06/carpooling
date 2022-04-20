import React, { useState } from "react";
import s from './Bookride.module.css';
import { createLocality } from "../api/users";

const Bookride = () => {

    const[form, setForm] = useState({locality: "", clarification: ""})   

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
        console.log(form)
    }

    return (
        <div>
            <div>from</div><input onChange={changeHandler} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>           
            <div>to</div><input onChange={changeHandler} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>
            <p><input type='text' placeholder='dd/mm/yyyy' name='form[datetime]' id='datetime' /></p>   
            <button className={s.create__btn} onClick={() => createLocality({...form})}>Add</button>
        </div>
        
      )
    }
    export default Bookride;