
// ========================================== Import part ================================================== 

import React, { useState, useContext } from "react";
import "./login.style.scss";
import { UserContext } from "../../context/context.compoment.jsx"; // Ensure this path is correct
import IBox from "../../components/input-box/input.component.jsx";
import { signInAuthWithEmailAndPassword } from '../../utils/firebase/firebase.js';


// ========================================== Function Part =================================================
const defaultFormFields = {
    email: '',
    password: '',
};

const Login = () => {
    const [formFields, setFormFields] = useState(defaultFormFields); 
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
        } catch (error) {
            if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
                alert("Incorrect Username / Password");
            } else {
                console.log(error);
            }
        }
    };


    // ============================================= Design Part =============================================================

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
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
