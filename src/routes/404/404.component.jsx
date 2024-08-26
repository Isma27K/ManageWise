import React from 'react';
import './404.style.scss';

const NotFound = () => {
    return (
        <div className="not-found">
            <div className='not-found-inner'>
                <h1>404</h1>
                <p>Sorry, the page you're looking for doesn't exist.</p>
                <a href="/">Go back to Home</a>
            </div>
        </div>
    );
};

export default NotFound;
