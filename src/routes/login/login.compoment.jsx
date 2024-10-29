import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './login.style.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // clear local storage first
    localStorage.clear();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const openNotification = (type, message, description) => {
            notification[type]({
                message,
                description,
                placement: 'topRight',
            });
        };

        try {
            let username = email;
            const response = await fetch('https://route.managewise.top/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    // Save the JWT token to localStorage
                    localStorage.setItem('jwtToken', data.token);
                    // Redirect to the dashboard or home page
                    navigate('/dashboard');
                } else {
                    openNotification('error', 'Login successful, but no token received', 'Please try again');
                }
            } else {
                const errorData = await response.json();
                openNotification('error', 'Username or password is incorrect', errorData.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            openNotification('error', 'Network error. Please try again.', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <span 
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </span>
                    </div>
                </div>
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
                <div className="login-forget">
                    <a href="/forget-password">Forgot Password?</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
