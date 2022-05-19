import React, { useState } from "react";
//import s from './Bookride.module.css';
import { createLocality, findLocality } from "../api/actions";
import { useDispatch, useSelector } from "react-redux";

const Bookride = () => {
    
    const[fromInputValue, setFromInputValue] = useState('');
    const[toInputValue, setToInputValue] = useState('');

    const dispatch = useDispatch();         
    

    const changeHandlerFrom = e => {
        //setForm({ ...form, [e.target.name]: e.target.value })
        setFromInputValue(e.target.value)     
        // console.log(inputValue)   
        dispatch(findLocality(e.target.value))           
    }
    const changeHandlerTo = e => {
        //setForm({ ...form, [e.target.name]: e.target.value })
        setToInputValue(e.target.value)     
        // console.log(inputValue)   
        dispatch(findLocality(e.target.value))           
    }
    //console.log(inputValue)
    //const suggestedRides = useSelector( state => state.ride.suggestedRides )  
    //console.log("suggestedRides:", suggestedRides)

    return (
        <div>
            <div>from</div><input value={fromInputValue} onInput={changeHandlerFrom} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>    
            {/* <p>{searchResults}</p>        */}
            <div>to</div><input value={toInputValue} onChange={changeHandlerTo} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>
            {/* <p><input type='text' placeholder='dd/mm/yyyy' name='form[datetime]' id='datetime' /></p>    */}
            {/* <button className={s.create__btn} onClick={() => createLocality({...form})}>Add</button> */}
        </div>
        
      )
    }
    export default Bookride;