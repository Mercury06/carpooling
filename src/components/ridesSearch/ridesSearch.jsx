import React from "react"
import { useDispatch } from "react-redux";
import { getRidesThunkCreator } from "../../reducers/rideReducer";
import RidesList from "./RidesList";

const FindAllRides = () => {

    const dispatch = useDispatch(); 

    return (
    <>
        <button onClick={() => dispatch(getRidesThunkCreator())}>findAllRides</button><br></br>
        <div><RidesList /></div>
    </>
    )
}

export default FindAllRides;