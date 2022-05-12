import React from "react"
import { useSelector } from "react-redux";
import "./rides.css"
const moment = require ('moment');
//import Loader from "../../assets/Loader/Loader";
//import BookCard from "../BookCard/BookCard";

const RidesList = () => {
   
    const rides = useSelector( state => state.ride.rides )

    return (
        <div>
            {/* { loader && <Loader />} */}
            <h1>Found {rides.length} results</h1>
            { rides && rides.length > 0
                ? rides.map((item) => {
                    return (                      
                        <div className="ride_item" key={item.id}>
                            <p><strong>from:</strong> {item.localityFrom}</p>
                            <p><strong>toward:</strong> {item.destination}</p>
                            <p><strong>date:</strong> {item.date}</p>
                        </div>
                        //           title={item.volumeInfo.title}
                        //           image={item.volumeInfo.imageLinks.smallThumbnail} />
                    )
                })
                : <div > <h3>list is empty</h3></div>}
        </div>
    )
}

export default RidesList;