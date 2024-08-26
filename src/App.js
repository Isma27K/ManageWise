// =============================== Dependancy Import ================================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// ========================  Pages import =========================================
import Login from "./routes/login/login.component.jsx";
import Register from "./routes/register/register.compoment.jsx";
import NotFound from "./routes/404/404.component.jsx";
import ForgotPassword from "./routes/reset-password/reset.component.jsx";
import Dashboard from './routes/dashboard/dashboard.component.jsx';

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<ForgotPassword />}/>
      <Route path='/Dashboard' element={<Dashboard />}/>

      {/*untu page error 404*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
