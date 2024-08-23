import React from "react";
import "./alert.style.scss";

const Alert = ({ label }) => { // Destructure label from props
    return (
        <div className="alert">
            {label}
        </div>
    );
}

export default Alert;
