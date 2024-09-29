import React from 'react';
import { Link } from 'react-router-dom';
import './404.style.scss';

const PageNotFound = () => {
    return (
        <div className="not-found-container">
            <img src='/404.png' alt="404" className="not-found-image" />
            <p>It looks like the page you are looking for doesn't exist.</p>
            <Link to="/">
                <button className="home-button">Back To Home</button>
            </Link>
        </div>
    );
}

export default PageNotFound;