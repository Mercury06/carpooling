import React, { useState } from "react"
import { useDispatch } from "react-redux";
import { findLocs } from "../api/actions";



const FindLocs = () => {

    const [locs, setLocs] = useState([])

    const clickHandler = async () => {
        const data = await findLocs();
        setLocs(data)
    }

    return (
    <>
      <button onClick={() => clickHandler()}>findLocs</button><br></br>
            <h1>Found {locs.length} results</h1>
            { locs && locs.length > 0
                ? locs.map((item) => {
                    return (                      
                        <div className="ride_item" key={item.id}>
                            <p><strong>locality:</strong> {item.locality}</p>
                            <p><strong>clarification:</strong> {item.clarification}</p>
                           
                        </div>                      
                    )
                })
                : <div > <h3>list is empty</h3></div>}
        
        
        
    </>
    )
}

export default FindLocs;