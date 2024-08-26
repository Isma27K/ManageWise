
// ========================================== Import part ================================================== 

import React, { useState } from "react";
import { createUserWithEmailAndPasswordCustom, createUserDocumentFromAuth } from '../../utils/firebase/firebase';
import "./register.style.scss";
import IBox from "../../components/input-box/input.component";
import Alert from "../../components/alert/alert.component.jsx";
import { useNavigate } from 'react-router-dom';


// ========================================== Function Part =================================================

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const Register = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;
    const [alertMessage, setAlertMessage] = useState(''); // Use state to handle alert messages
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    };

    const resetFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const { user } = await createUserWithEmailAndPasswordCustom(email, password);
            await createUserDocumentFromAuth(user, { displayName });
            resetFields();
            console.log(user);
            navigate("/")
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setAlertMessage("Email Already Exist");
                setTimeout(function() {
                    setAlertMessage(''); // Hide the alert after 5 seconds
                }, 20000);
            } else {
                console.error("Error creating user:", error);
            }
        }
    };

    // ============================================= Design Part =============================================================

    return (
        <div className="register">
            <div className="register-wrapper">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                {alertMessage && <Alert label={alertMessage} />} {/* Place the Alert directly after the h2 */}
                <div>
                    <IBox
                        type="text"
                        required
                        label="Name"
                        onChange={handleChange}
                        name="displayName"
                        value={displayName}
                    />

                    <IBox
                        type="email"
                        name="email"
                        label="Enter your email"
                        required
                        onChange={handleChange}
                        value={email}
                    />

                    <IBox
                        type="password"
                        name="password"
                        label="Enter your password"
                        required
                        onChange={handleChange}
                        value={password}
                    />

                    <IBox
                        type="password"
                        name="confirmPassword"
                        label="Confirm Password"
                        required
                        onChange={handleChange}
                        value={confirmPassword}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
        </div>
    );
};

export default Register;
