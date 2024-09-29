import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/home/Home.Routes';
import PageNotFound from "./routes/404/404.Routes";
import Login from './routes/login/login.compoment';
import Register from './routes/register/register.component';

function App() {
    return (
        <Router>
            <div className="app-container">
                <div className="content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/*================================================= */}
                        <Route path="/" element={<Login />} />
                        <Route path="/Dashboard" element={<Home />} />

                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
