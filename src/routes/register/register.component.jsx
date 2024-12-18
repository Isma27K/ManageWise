import React, { useState } from 'react';
import { notification } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './register.style.scss';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const params = new URLSearchParams(window.location.search);
    const invitation = params.get('invitation');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const openNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
            placement: 'topRight',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const errors = {};
        if (!formData.name) errors.name = 'Name is required';
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email address is invalid';
        }
        if (!formData.password) errors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            //openNotification('error', 'Validation Error', 'Passwords do not match.');
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                const response = await fetch('https://route.managewise.top/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        id: invitation
                    }),
                });

                // if success
                if (response.status === 200) {
                    openNotification('success', 'Registration Successful', 'You have registered successfully.');
                    // Clear the form
                    setFormData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    });
                    setErrors({});
                    navigate('/login');
                    // Optionally, you can redirect the user here
                // if not success
                } else {
                    const errorData = await response.json();
                    openNotification('error', 'Registration Failed', errorData.message || 'An error occurred during registration.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                openNotification('error', 'Registration Failed', 'An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span 
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </span>
                    </div>
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <div className="password-input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <span 
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </span>
                    </div>
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
};
export default Register;
