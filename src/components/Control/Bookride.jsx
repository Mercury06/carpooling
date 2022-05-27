import React, { useState } from "react";
//import s from './Bookride.module.css';
import { createLocality, findLocality } from "../api/actions";
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";
import { Stack } from "@mui/material";
import {makeStyles} from "@emotion/styled"
import { Autocomplete } from "@mui/material";
import { Box } from "@mui/system";
import { setSuggestedRides } from "../../reducers/rideReducer";

// const useStyles = makeStyles({
//     paper: {
//       border: "4px solid black"
//     }
//   });

const Bookride = () => {
    
    const[fromInputValue, setFromInputValue] = useState('');
    const[toInputValue, setToInputValue] = useState('');
    const[selectedItem, setSelectedItem] = useState({});

    const dispatch = useDispatch();     
   
    
    // const sugRides = [
    //     {locality: "Rome"},
    //     {locality: "Keln"},
    //     {locality: "Chicago"},
    //     {locality: "Brazil"},
    //     {locality: "Columbia"}
    // ]
    

    const changeHandlerFrom = e => {
        let value = e.target.value;
        if (!value) {
            dispatch(setSuggestedRides([]))
        
        };
        //setForm({ ...form, [e.target.name]: e.target.value })
        setFromInputValue(value);     
        // console.log(inputValue)   
        dispatch(findLocality(value));           
    }
    const changeHandlerTo = e => {
        //setForm({ ...form, [e.target.name]: e.target.value })
        setToInputValue(e.target.value)     
        // console.log(inputValue)   
        dispatch(findLocality(e.target.value))           
    }
    //console.log(inputValue)
    const suggestedRides = useSelector( state => state.ride.suggestedRides )  
    //console.log("suggestedRides:", suggestedRides)
    //console.log("fromInputValue:", fromInputValue)
    const blurHandler = () => {
        console.log("input blurred")
    }
    const onInputHandler = () => {
        console.log("onReseted")
    }
    const onSuggestSelect = (e, {item}) => {
        setSelectedItem(item)
        setFromInputValue(item.locality)
        dispatch(setSuggestedRides([]))
    }

    return (
        <div>
            <div>from</div><input value={fromInputValue} onChange={changeHandlerFrom} type="text" name="locality" placeholder="Enter locality" autoComplete="off" /><br></br>    
            {suggestedRides && suggestedRides.length > 0
                ? suggestedRides.map((item, i) => {
                    return (  
                        <p key={i} onClick={(e) => onSuggestSelect (e, {item})}>{item.locality}</p>
                        )
                    })
                : <div > <h3>list is empty</h3></div>}      
            <div>to</div><input value={toInputValue} onChange={changeHandlerTo} type="text" name="locality" placeholder="Enter locality" autoComplete="off" /><br></br>
            {suggestedRides && suggestedRides.length > 0
                ? suggestedRides.map((item, i) => {
                    return (  
                        <p key={i}>{item.locality}</p>
                        )
                    })
                : <div > <h3>list is empty</h3></div>}
            {/* <button className={s.create__btn} onClick={() => createLocality({...form})}>Add</button> */}
        
       
            <Autocomplete
            filterOptions={(x) => x}
            style={{width: 300}}
            onChange={changeHandlerFrom}
            //noOptionsText="No Options found" 
            //options={suggestedRides && suggestedRides > 0 ? suggestedRides.map((item) => item.locality) : []}
            options={suggestedRides}
            getOptionLabel={(options) => options.locality}
            
            renderInput={(params) => (
                <TextField {...params} style={{width: 300, border: "1px solid gray"}} label="from" onChange={changeHandlerFrom} />
            )}
            />
        </div>
      )
    }
    export default Bookride;