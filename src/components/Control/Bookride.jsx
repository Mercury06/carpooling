import React, { useEffect, useState } from "react";
import s from './Bookride.module.css';
import { createLocality } from "../api/actions";
import axios from "axios";

const Bookride = () => {

    const[form, setForm] = useState({locality: "", clarification: ""});
    const[inputValue, setInputValue] = useState('');
    const [localities, setLocalities] = useState([]);

    useEffect(() => {
        const suggest = async() => {
            debugger
            const response = await axios.post('http://localhost:9000/api/settings/findlocality', {inputValue});
            console.log(response.data)
            setLocalities(response.data)
        }
        suggest();
    }, [inputValue])
    

    const changeHandler = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setInputValue(e.target.value)
        //console.dir("received from server:", localities) 
        console.log("inputed:", inputValue)
    }

    return (
        <div>
            <div>from</div><input onChange={changeHandler} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>    
            {/* <p>{searchResults}</p>        */}
            <div>to</div><input onChange={changeHandler} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>
            <p><input type='text' placeholder='dd/mm/yyyy' name='form[datetime]' id='datetime' /></p>   
            <button className={s.create__btn} onClick={() => createLocality({...form})}>Add</button>
        </div>
        
      )
    }
    export default Bookride;