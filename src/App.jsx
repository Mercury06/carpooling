
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/autorization/Login";
import Registration from "./components/autorization/Registration";
import Navbar from "./components/navbar/navbar";


function App() {
  return (
  
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />

        </Routes>
        
      </div>

    
  );
}

export default App;
