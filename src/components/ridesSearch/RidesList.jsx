import React from "react"
import { useSelector } from "react-redux";
//import Loader from "../../assets/Loader/Loader";
//import BookCard from "../BookCard/BookCard";

const RidesList = () => {
   
    const rides = useSelector( state => state.ride.rides )

    return (
        <div>
            {/* { loader && <Loader />} */}
            <h1>Found XXX results</h1>
            { rides && rides.length > 0
                ? rides.map((item) => {
                    return (                      
                        <div key={item.id}>
                            <p>from: {item.localityFrom}</p>
                            <p>toward: {item.destination}</p>
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