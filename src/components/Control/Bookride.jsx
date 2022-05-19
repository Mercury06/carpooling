import React, { useState } from "react";
//import s from './Bookride.module.css';
import { createLocality, findLocality } from "../api/actions";
import { useDispatch, useSelector } from "react-redux";

const Bookride = () => {
    
    const[inputValue, setInputValue] = useState('');

    const dispatch = useDispatch();
         
    

    const changeHandler = e => {
        //setForm({ ...form, [e.target.name]: e.target.value })
         setInputValue(e.target.value)        
         dispatch(findLocality(inputValue))            
    }
    //console.log(inputValue)
    const suggestedRides = useSelector( state => state.ride.suggestedRides )  
    console.log("suggestedRides:", suggestedRides)

    return (
        <div>
            <div>from</div><input value={inputValue} onInput={changeHandler} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>    
            {/* <p>{searchResults}</p>        */}
            <div>to</div><input value={inputValue} onChange={changeHandler} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>
            {/* <p><input type='text' placeholder='dd/mm/yyyy' name='form[datetime]' id='datetime' /></p>    */}
            {/* <button className={s.create__btn} onClick={() => createLocality({...form})}>Add</button> */}
        </div>
        
      )
    }
    export default Bookride;