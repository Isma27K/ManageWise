import React from "react";
import "./login.style.scss";
import IBox from "../../components/input-box/input.component.jsx";

const Login = () => {
    return (
        <div className="wrapper">
            <form action="#">
                <h2>Login</h2>
                <div className="input-field">
                    <IBox a="email" l="Enter your email"/>
                </div>
                <div className="input-field">
                    <IBox a="password" l="Enter your password"/>
                </div>
                <div className="forget">
                    <a href="#">Forgot password?</a>
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default Login;
