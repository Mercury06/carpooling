import React, { useState } from "react";
import { createLocality } from "../api/actions";

import s from "./Settings.module.css"

const Settings = () => {

    const[form, setForm] = useState({locality: "", clarification: ""})   

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
        console.log(form)
    }
    
    return (
        <div>
            <h3>Form add locality</h3>
            <input onChange={changeHandler} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>           
            <input  onChange={changeHandler} type="text" name="clarification" placeholder="Add some clarification" /> <br></br>            
            <button className={s.create__btn} onClick={() => createLocality({...form})}>Add</button>
        </div>
    )
}
export default Settings;