import React, { useContext, useState } from 'react';
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
    const [avatarLoadError, setAvatarLoadError] = useState(false);

    //console.log(user);

    // Function to get the first letter of the name
    const getNameInitial = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        window.location.reload();
    }

    // Define menu items for the avatar dropdown
    const menu = (
        <Menu className="menu">
            <Menu.Item key="1" icon={<DownloadOutlined />} className="menu-item">
                Downloads
            </Menu.Item>
            <Menu.Item key="2" icon={<BookOutlined />} className="menu-item">
                Saved
            </Menu.Item>
            <Menu.Item key="3" icon={<SettingOutlined />} className="menu-item">
                Settings
            </Menu.Item>
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
                            src={user?.avatarUrl}
                            className="avatar"
                            onError={() => setAvatarLoadError(true)}
                        >
                            {(avatarLoadError || !user?.avatarUrl) && getNameInitial(user?.name)}
                        </Avatar>
                    </Dropdown>

                </div>
            </nav>
        </>
    );
}

export default Nav;
