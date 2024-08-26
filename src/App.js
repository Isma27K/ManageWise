import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from "./routes/login/login.component.jsx";
import Register from "./routes/register/register.compoment.jsx";
import NotFound from "./routes/404/404.component.jsx"; // Optional: For 404 page
import ForgotPassword from "./routes/reset-password/reset.component.jsx";

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Optional: Route for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
      <Route path="/reset" element={<ForgotPassword />}/>
    </Routes>
  );
}

export default App;
