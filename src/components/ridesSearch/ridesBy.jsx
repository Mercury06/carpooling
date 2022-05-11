import React, { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from "react-redux";
import { findByThunkCreator } from "../../reducers/rideReducer";
import RidesList from "./RidesList";


const RidesBy = () => {

    const[startDate, setStartDate] = useState(new Date());
    const[startDateISO, setStartDateISO] = useState();
    const dispatch = useDispatch();    

    const onChangeDateHandler = value => {
       
        setStartDate(value)
        let ISODate = startDate.toISOString()
        setStartDateISO(ISODate)
        console.log(startDate)
        console.log(startDateISO)
        //console.log("toIso:",value.toISOString())
    }    

    return (
        <div>
            <DatePicker 
                selected={startDate} 
                onChange={onChangeDateHandler} 
                dateFormat="dd MMM yyy" 
                minDate={new Date()}
            />
            <button onClick={() => dispatch(findByThunkCreator(startDateISO))}>FindBy</button>
            <RidesList />
        </div>
    )
}

export default RidesBy;