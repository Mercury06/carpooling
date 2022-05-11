import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from "react-redux";
import { findByThunkCreator } from "../../reducers/rideReducer";
import RidesList from "./RidesList";


const RidesBy = () => {

    const[startDate, setStartDate] = useState(new Date());
    const dispatch = useDispatch();    

    const onChangeDateHandler = value => {
        setStartDate(value)
    }    

    return (
        <div>
            <DatePicker 
                selected={startDate} 
                onChange={onChangeDateHandler} 
                dateFormat="dd MMM yyy" 
            />
            <button onClick={dispatch(findByThunkCreator(startDate))}>FindBy</button>
            <RidesList />
        </div>
    )
}

export default RidesBy;