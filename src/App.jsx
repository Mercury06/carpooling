import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { auth } from './components/api/actions';
import Login from './components/autorization/Login';
import Registration from './components/autorization/Registration';
import Header from './components/header/header';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Settings from './components/Control/Settings';
import Bookride from './components/Control/Bookride';
import FindAllRides from './components/ridesSearch/ridesSearch';
import RidesBy from './components/ridesSearch/ridesBy';
import FindLocs from './components/locsSearch/locsSearch';

function App() {
  const isAuth = useSelector((state) => state.user.isAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth());
  });

  return (
    <div className="app-wrapper">
      <Header />
      {isAuth && <Navbar />}
      <div className="app-wrapper-content">
        <Routes>
          {!isAuth && <Route path="/registration" element={<Registration />} />}

          {!isAuth && <Route path="/login" element={<Login />} />}
          <Route path="/bookride" element={<Bookride />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/findall" element={<FindAllRides />} />
          <Route path="/findlocs" element={<FindLocs />} />
          <Route path="/findby" element={<RidesBy />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
