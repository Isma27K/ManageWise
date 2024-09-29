import React from 'react';
import './footer.style.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} ManageWise. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
