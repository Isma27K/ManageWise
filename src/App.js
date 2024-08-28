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

// ======================== Functions =============================================
import ProtectedRoute from './functions/protectedRoute.js';
import CheckLogin from './functions/checkIfLoginOrNot.js';

localStorage.removeItem('currentUser');

function App() {
  return (
    <Routes>
      <Route path="/" element={<CheckLogin element={Login} redirectTo="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<ForgotPassword />} />

      {/* For the 404 error page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

