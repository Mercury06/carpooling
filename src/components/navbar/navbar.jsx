import React from 'react';
import s from './Navbar.module.css';
import {NavLink} from "react-router-dom";

const Navbar = () => {
    return (
       <nav className={s.nav}>
        <div className={s.item}>
          <NavLink to="/profile" activeClassName={s.activeLink}> Book trip</NavLink>
        </div>
        <div className={s.item}>
          <NavLink to="/dialogs" activeClassName={s.activeLink}> Find all trips</NavLink>
        </div>
        <div className={s.item}>
          <NavLink to="/users" activeClassName={s.activeLink}> Find trips by params</NavLink>
        </div>
        <div className={s.item}>
        <NavLink to="/news" activeClassName={s.activeLink}> Create trip as captain</NavLink>          
        </div>        
        <div className={s.item}>
        <NavLink to="/settings" activeClassName={s.activeLink}>Settings</NavLink>        
        </div>
        
      </nav>)
    }
    export default Navbar;