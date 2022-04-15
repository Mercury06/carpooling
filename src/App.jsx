
import { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./components/api/users";
import Login from "./components/autorization/Login";
import Registration from "./components/autorization/Registration";
import Navbar from "./components/navbar/navbar";
import './App.css'


function App() {

  const isAuth = useSelector(state => state.user.isAuth)
  const dispatch = useDispatch()

  const store = useStore()
  console.log("from store:", store.getState())
  
  useEffect(() => {
    dispatch(auth())    
  })

  return (
  
      <div className="App">
        <Navbar />
        <div className="wrap">
          {!isAuth &&
            <Routes>
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
          </Routes>
          }
        
        </div>
        
      </div>

    
  );
}

export default App;
