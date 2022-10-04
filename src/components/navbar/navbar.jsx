import React from 'react';
import s from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

// edit activeClassName
const Navbar = () => {
  return (
    <nav className={s.nav}>
      <div className={s.item}>
        <NavLink to="/bookride" activeClassName={s.activeLink}>
          {' '}
          Book ride
        </NavLink>
      </div>
      <div className={s.item}>
        <NavLink to="/findall" activeClassName={s.activeLink}>
          {' '}
          Find all rides
        </NavLink>
      </div>
      <div className={s.item}>
        <NavLink to="/findlocs" activeClassName={s.activeLink}>
          {' '}
          Find all localities
        </NavLink>
      </div>
      <div className={s.item}>
        <NavLink to="/findby" activeClassName={s.activeLink}>
          {' '}
          Find rides by params
        </NavLink>
      </div>
      <div className={s.item}>
        <NavLink to="/createtrip" activeClassName={s.activeLink}>
          {' '}
          Create ride as captain
        </NavLink>
      </div>
      <div className={s.item}>
        <NavLink to="/settings" activeClassName={s.activeLink}>
          Settings
        </NavLink>
      </div>
    </nav>
  );
};
export default Navbar;
