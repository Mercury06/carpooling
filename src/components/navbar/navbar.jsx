import React from 'react';
import s from './Navbar.module.css';
import {NavLink} from "react-router-dom";

import {ProfileIcon, MessagesIcon, UsersIcon, NewsIcon, MusicNoteIcon, SettingsIcon} from './../assets/Icons/Boxicons';

const Navbar = () => {
    return (
       <nav className={s.nav}>
        <div className={s.item}>
          <NavLink to="/profile" activeClassName={s.activeLink}><ProfileIcon />  Profile</NavLink>
        </div>
        <div className={s.item}>
          <NavLink to="/dialogs" activeClassName={s.activeLink}><MessagesIcon />  Messages</NavLink>
        </div>
        <div className={s.item}>
          <NavLink to="/users" activeClassName={s.activeLink}><UsersIcon /> Users</NavLink>
        </div>
        <div className={s.item}>
        <NavLink to="/news" activeClassName={s.activeLink}><NewsIcon /> News</NavLink>          
        </div>
        <div className={s.item}>
        <NavLink to="/music" activeClassName={s.activeLink}><MusicNoteIcon /> Music</NavLink>        
        </div>        
        <div className={s.item}>
        <NavLink to="/settings" activeClassName={s.activeLink}><SettingsIcon />  Settings</NavLink>        
        </div>
        
      </nav>)
    }
    export default Navbar;