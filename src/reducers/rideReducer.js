import { findAllRides, findRidesBy } from "../components/api/actions"

const SET_RIDES = "SET_RIDES"
const SET_SUGGEST_RIDES = "SET_SUGGEST_RIDES"


const defaultState = {
    rides: [],
    suggestedRides: []
   
}

export default function rideReducer (state = defaultState, action) {
    //debugger
    switch (action.type) {

        case SET_RIDES:         
            return {
                ...state,
                rides: action.payload,      
            }    
    
        case SET_SUGGEST_RIDES:         
            return {
                ...state,
                suggestedRides: action.payload,      
            }

    default:
        return state
    }
}


export const setRides = (rides) => ({ type: SET_RIDES, payload: rides })
export const setSuggestedRides = (rides) => ({ type: SET_SUGGEST_RIDES, payload: rides })


export const getRidesThunkCreator = () => {
    //debugger
    return async (dispatch) => {     
        try {   
            //dispatch(showLoader())
            //const response = await booksAPI.getBooks({ ...form})
            const rides = await findAllRides()
            console.log(rides)
            
            dispatch (setRides (rides));
            //console.log("from thunk:", response.items)
            //dispatch(hideLoader())  
        } catch (e) {
            alert(e.response.data)
        }  
}}    

export const findByThunkCreator = (date) => {
    debugger
    return async (dispatch) => {     
        try {   
            //dispatch(showLoader())
            //const response = await booksAPI.getBooks({ ...form})
            const rides = await findRidesBy(date)
            console.log(rides)
            
            dispatch (setRides (rides));
            //console.log("from thunk:", response.items)
            //dispatch(hideLoader())  
        } catch (e) {
            alert(e.response.data)
        }  
}}    