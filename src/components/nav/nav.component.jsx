import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Corrected import for Link
import { DownloadOutlined, BookOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Input, Menu, Dropdown } from 'antd';
import { UserContext } from '../../contexts/UserContext';

// Import assets
import './nav.style.scss'; // Import the SCSS file for styling

const avatarSize = {
    xs: 30, sm: 35, md: 40, lg: 45, xl: 50, xxl: 55
};

const Nav = () => {
    const { user } = useContext(UserContext);
    const [avatarSrc, setAvatarSrc] = useState('');
    const [avatarLoadError, setAvatarLoadError] = useState(false);

    useEffect(() => {
        if (user && user.avatar) {
            setAvatarSrc(user.avatar);
            setAvatarLoadError(false);
        }
    }, [user]);

    //console.log(user);

    // Function to get the first letter of the name
    const getNameInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        window.location.reload();
    }

    const handleAvatarError = () => {
        setAvatarLoadError(true);
        setAvatarSrc(''); // Clear the src to show initials
    };

    // Define menu items for the avatar dropdown
    const menu = (
        <Menu className="menu">
            <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout} className="menu-item">
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <nav className="nav">
                <div className="nav-search">
                    <Input placeholder="What You Looking For..." />
                </div>
                <div className="nav-title">
                    <Link to="/dashboard"><h2>ManageWise</h2></Link> {/* Corrected usage of Link */}
                </div>

                <div className="nav-cart-avatar">
                    {/* Avatar with Dropdown */}
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                        <Avatar
                            size={avatarSize.xxl}
                            src={avatarSrc}
                            className="avatar"
                            onError={handleAvatarError}
                        >
                            {(avatarLoadError || !avatarSrc) && getNameInitial(user?.name)}
                        </Avatar>
                    </Dropdown>

                </div>
            </nav>
        </>
    );
}

export default Nav;
