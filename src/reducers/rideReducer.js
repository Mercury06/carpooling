const SET_RIDES = "SET_RIDES"


const defaultState = {
    rides: [],
   
}

export default function rideReducer (state = defaultState, action) {
    switch (action.type) {
        case SET_RIDES:         
            return {
                ...state,
                rides: action.payload,      
            }
       
        default:
            return state
    }
}

export const setRides = (rides) => ({ type: SET_RIDES, payload: rides })