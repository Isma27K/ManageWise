import React from "react";

const IBox = ({ label, ...otherProps }) => {
    return (
        <div className="input-field">
            <input {...otherProps} />
            <label>{label}</label>
        </div>
    );
};

export default IBox;
