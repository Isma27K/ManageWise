import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/home/Home.Routes';
import PageNotFound from "./routes/404/404.Routes";
import Login from './routes/login/login.compoment';
import ProtectedRoute from './components/ProtectedRoute';
import ValidateRegister from './routes/vilidateRegister/vilidateReg';

function App() {
    return (
        <Router>
            <div className="app-container">
                <div className="content">
                    <Routes>
                        <Route path="/login" element={<Login />} />


                        {/*<Route 
                            path="/register" 
                            element={
                                <ProtectedRoute requiredAuth="authLink" redirectTo="/login">
                                    <Register />
                                </ProtectedRoute>
                            } 
                        />*/}

                        <Route path="/register" element={<ValidateRegister />} />

                        <Route path="/" element={<Login />} />


                        <Route 
                            path="/Dashboard" 
                            element={
                                <ProtectedRoute requiredAuth="jwt" redirectTo="/login">
                                    <Home />
                                </ProtectedRoute>
                            } 
                        />

                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
