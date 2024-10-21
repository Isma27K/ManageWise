import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import './forget.scss';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const openNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
            placement: 'topRight',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('https://isapi.ratacode.top/auth/forget-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                openNotification('success', 'Reset Email Sent', 'Please check your email for instructions to reset your password.');
                navigate('/login');
            } else {
                const errorData = await response.json();
                openNotification('error', 'Request Failed', errorData.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error during password reset request:', error);
            openNotification('error', 'Network Error', 'Please check your internet connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forget-password-container">
            <form className="forget-password-form" onSubmit={handleSubmit}>
                <h2>Forgot Password</h2>
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
                <button type="submit" className="reset-button" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Reset Password'}
                </button>
                <div className="back-to-login">
                    <a href="/login">Back to Login</a>
                </div>
            </form>
        </div>
    );
};

export default ForgetPassword;
