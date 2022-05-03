import React, { useState } from "react";
import s from './Bookride.module.css';
import { createLocality, findLocality } from "../api/actions";
import { useDispatch, useSelector, useStore } from "react-redux";

const Bookride = () => {

    const[form, setForm] = useState({locality: "", clarification: ""});
    const[inputValue, setInputValue] = useState('');

    const dispatch = useDispatch();
    const store = useStore()
    const suggestedRides = useSelector( state => state.ride.suggestedRides )       
    

    const changeHandler = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setInputValue(e.target.value)
        dispatch(findLocality(e.target.value))               
    }

    console.log("from store:", store.getState())
    console.log("suggestedRides:", suggestedRides)

    return (
        <div>
            <div>from</div><input onChange={changeHandler} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>    
            {/* <p>{searchResults}</p>        */}
            <div>to</div><input onChange={changeHandler} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>
            {/* <p><input type='text' placeholder='dd/mm/yyyy' name='form[datetime]' id='datetime' /></p>    */}
            <button className={s.create__btn} onClick={() => createLocality({...form})}>Add</button>
        </div>
        
      )
    }
    export default Bookride;