import React, { useState } from "react";
import s from './Bookride.module.css'
import { createLocality, findLocality } from "../api/actions";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedRides } from "../../reducers/rideReducer";

const Bookride = () => {
    
    const[fromInputValue, setFromInputValue] = useState('');
    const[toInputValue, setToInputValue] = useState('');

    const dispatch = useDispatch();         
    
    // const debounce =(func) => {
    //     let timer;
    //     return function (...args) {
    //         const context = this;
    //         if (timer) clearTimeout(timer)
    //         timer = setTimeout( () => {
    //             timer = null
    //             func.apply(context, args);
    //         }, 1000);
    //     }
    // }    

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
    const onSuggestionSelected = (e, item) => {
        // if (method === "enter") {
        //   event.preventDefault();
        // }
        e.stopPropagation();
        setFromInputValue(item.locality);
        dispatch(setSuggestedRides([]))        
    }
    //console.log(inputValue)
    const suggestedRides = useSelector( state => state.ride.suggestedRides )  
    //console.log("suggestedRides:", suggestedRides)

    //const debouncedHandler = debounce(changeHandlerFrom )

    return (
        <div>
            <div>from</div><input className={s.search} list="from_input" value={fromInputValue} onChange={changeHandlerFrom} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>    
            { suggestedRides && suggestedRides.length > 0
                ? <div className={s.autocomplete}>
                    {suggestedRides.map((item, i) => {
                    
                    return (                      
                        <div className={s.autocomplete_items} key={i} >
                            <span onClick={ (e) => onSuggestionSelected(e, item)}>{item.locality}</span>
                        </div>
                    )})}
                    </div>
                : null}
             
            <div>to</div><input value={toInputValue} onChange={changeHandlerTo} type="text" name="locality" placeholder="Enter locality" autoFocus="autofocus" /><br></br>
            {/* <p><input type='text' placeholder='dd/mm/yyyy' name='form[datetime]' id='datetime' /></p>    */}
            {/* <button className={s.create__btn} onClick={() => createLocality({...form})}>Add</button> */}
        </div>
        
      )
    }
    export default Bookride;



// ******** add with redux-form submit check value is not empty ******* // 
    // suggestions={suggestions}
    // onSuggestionsFetchRequested={async ({ value }) => {
    //   if (!value) {
    //     setSuggestions([]);
    //     return;
    //   } 
    // }   