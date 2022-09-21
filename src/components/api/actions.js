import axios from 'axios';
import { useState } from 'react';
import { setSuggestedRides } from '../../reducers/rideReducer';
import { setUser } from '../../reducers/userReducer';

export const registration = async ({ ...form }) => {
  //debugger
  try {
    const response = await axios.post('http://localhost:9000/api/auth/registration', { ...form });
    console.log(response.data.message);
  } catch (e) {
    alert(e.response.data.message);
  }
};

export const login = ({ ...form }) => {
  //debugger;
  return async (dispatch) => {
    try {
      const response = await axios.post('http://localhost:9000/api/auth/login', { ...form });

      dispatch(setUser(response.data.user));
      localStorage.setItem('token', response.data.token);
      console.log('token', response.data.token); //edit
    } catch (e) {
      //alert(e.response.data.message)
    }
  };
};

export const auth = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:9000/api/auth/auth', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(setUser(response.data.user));
      localStorage.setItem('token', response.data.token);
    } catch (e) {
      alert(e.response.data.message);
      localStorage.removeItem('token');
    }
  };
};

export const findAllRides = async () => {
  //debugger
  try {
    const response = await axios.get('http://localhost:9000/api/settings/findall');
    const data = response.data;
    console.log(data);
    return data;
  } catch (e) {
    alert(e.response.data.message);
  }
};

export const findLocs = async () => {
  //debugger
  try {
    const response = await axios.get('http://localhost:9000/api/settings/findlocs');
    const data = response.data;
    console.log(data);
    return data;
  } catch (e) {
    alert(e.response.data.message);
  }
};

export const findRidesBy = async (date) => {
  debugger;
  try {
    //const response = await axios.get(`http://localhost:9000/api/settings/findby?date=${startDateISO}`)
    const response = await axios.get(`http://localhost:9000/api/settings/findridesby?date=${date}`);
    const data = response.data;
    console.log('from action concatinated fetch:', data);
    return data;
  } catch (e) {
    alert(e.response.data.message);
  }
};

/****** перенести из users */
export const createLocality = async ({ ...form }) => {
  //debugger
  try {
    const response = await axios.post('http://localhost:9000/api/settings/createlocality', {
      ...form,
    });
    console.log(response.data.message);
  } catch (e) {
    alert(e.response.data.message);
  }
};

export function findLocality(search) {
  return async (dispatch) => {
    try {
      console.log('from server api search:', search);
      //const response = await axios.post("http://localhost:9000/api/settings/findlocality", {locality: payload})
      const response = await axios.get(
        `http://localhost:9000/api/settings/findlocality?search=${search}`,
      );

      dispatch(setSuggestedRides(response.data));
      return response.data;
    } catch (e) {
      alert(e.message);
    }
  };
}

// export function findAllLocalities () {

//     return async dispatch => {
//         try {

//             //const response = await axios.post("http://localhost:9000/api/settings/findlocality", {locality: payload})
//             const response = await axios.get(`http://localhost:9000/api/settings/findlocality?search=${search}`)

//             dispatch(setSuggestedRides(response.data))
//             return response.data

//         } catch (e) {
//             alert(e.message)
//         }
//     }
// }
