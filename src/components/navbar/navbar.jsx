import React, { useState } from 'react';
//import { useDispatch, useSelector } from 'react-redux';
import './navbar.css'
//import Logo from '../Icons/ethers.svg'
//import {NavLink} from "react-router-dom";
//import {logout} from "../../reducers/userReducer"
//import {showLoader} from "../../reducers/appReducer";
//import {getFiles, searchFiles} from "../../actions/file";


const Navbar = () => {

    // const isAuth = useSelector( state => state.user.isAuth )
    // const user = useSelector( state => state.user.currentUser )
    // const login = user.email;
    // const currentDir = useSelector( state => state.files.currentDir)
    // const dispatch = useDispatch()
    // const [searchName, setSearchName] = useState('')
    // const [searchTimeout, setSearchTimeout] = useState(false)

    // function searchChangeHandler(e) {
    //     setSearchName(e.target.value)
    //     if (searchTimeout !== false) {
    //         clearTimeout(searchTimeout)
    //     }
    //     dispatch(showLoader())
    //     if(e.target.value !== '') {
    //         setSearchTimeout(setTimeout((value) => {
    //             dispatch(searchFiles(value));
    //         }, 1000, e.target.value))
    //     } else {
    //         dispatch(getFiles(currentDir))
    //     }
    // }

    return (
        <div className="navbar">
        
            <div className="container">
                {/* <div>
                    <img src={Logo} alt="" className="navbar_logo" />
                </div>
                <div className="navbar__header">MERCURY CLOUD</div>            

                    { isAuth && 
                        <input className="navbar__search" 
                               type="text" 
                               placeholder='search...'
                               value={searchName}
                               onChange={e => searchChangeHandler(e)} />} 
                    { !isAuth && <div className="navbar__login"><NavLink to="/login">Login</NavLink></div>}                
                    { !isAuth && <div className="navbar__registration"><NavLink to="/registration">Registration</NavLink></div>}

                    
                    { isAuth && <> <div className="navbar__login" title='logout' onClick={() => dispatch(logout()) }><NavLink to="/login"><b>{login}</b></NavLink></div></>}
                      */}
            </div>
        </div>
    );
};

export default Navbar;