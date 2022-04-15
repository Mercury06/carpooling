
import { useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/autorization/Login";
import Registration from "./components/autorization/Registration";
import Navbar from "./components/navbar/navbar";


function App() {

  const isAuth = useSelector(state => state.user.isAuth)
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
