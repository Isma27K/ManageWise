// ========================================== Import part ================================================== 

import React, { useState, useContext } from "react";
import "./login.style.scss";
import { UserContext } from "../../context/context.compoment.jsx"; // Ensure this path is correct
import IBox from "../../components/input-box/input.component.jsx";
import { signInAuthWithEmailAndPassword } from '../../utils/firebase/firebase.js';
import Alert from "../../components/alert/alert.component.jsx";

// ========================================== Function Part =================================================
const defaultFormFields = {
    email: '',
    password: '',
};

const Login = () => {
    const [formFields, setFormFields] = useState(defaultFormFields); 
    const [alertMessage, setAlertMessage] = useState(''); // Use state to handle alert messages
    const { email, password } = formFields;

    const { setCurrentUser } = useContext(UserContext);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const { user } = await signInAuthWithEmailAndPassword(email, password);
            setCurrentUser(user);
            console.log(user);
            setFormFields(defaultFormFields); // Optionally reset fields after login
            setAlertMessage(''); // Clear any previous alert message on successful login
        } catch (error) {
            if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
                setAlertMessage("Incorrect Email Or Password");
                setTimeout(function() {
                    setAlertMessage(''); // Hide the alert after 5 seconds
                }, 20000);
            } else {
                console.error(error);
            }
        }
    };

    // ============================================= Design Part =============================================================

    // Inside Login component's return statement
    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {alertMessage && <Alert label={alertMessage} />} {/* Place the Alert directly after the h2 */}
                <div>
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
                </div>
                <div className="forget">
                    <a href="#">Forgot password?</a>
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default Login;
