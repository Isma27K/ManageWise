import React from "react";
import "./LoadingComponent.scss";

const LoadingComponent = () => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading...</p>
        </div>
    );
}

export default LoadingComponent;