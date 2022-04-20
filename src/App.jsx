
import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./components/api/users";
import Login from "./components/autorization/Login";
import Registration from "./components/autorization/Registration";
import Header from "./components/header/header";
import './App.css'
import Navbar from "./components/Navbar/Navbar";
import Settings from "./components/Control/Settings";
import Bookride from "./components/Control/Bookride";


function App() {

  const isAuth = useSelector(state => state.user.isAuth)
  const dispatch = useDispatch()

  const store = useStore()
  console.log("from store:", store.getState())
  
  useEffect(() => {
    dispatch(auth())    
  })

  return (
  
      <div className="app-wrapper">
        <Header />
        { isAuth && <Navbar /> }
        <div className="app-wrapper-content">
          
            <Routes>
            {!isAuth && <Route path="/registration" element={<Registration />} />}
              
            {!isAuth &&  <Route path="/login" element={<Login />} />}
              <Route path="/bookride" element={<Bookride />} />
              <Route path="/settings" element={<Settings />} />
          </Routes>
          
        
        </div>
        
      </div>

    
  );
}

export default App;
