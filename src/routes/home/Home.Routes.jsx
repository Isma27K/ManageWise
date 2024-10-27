import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Nav from "../../components/nav/nav.component";
import Dashboard from "../../components/dashboard/dashboard.component";
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import loadingAnimation from '../../asset/gif/loading.json'; // Make sure this JSON file exists

const Home = () => {
    const { user, setUser, setAllUsers } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const token = localStorage.getItem('jwtToken');

    const openNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
            placement: 'topRight',
        });
    };

    useEffect(() => {
        if (!token) {
            console.error('No JWT token found');
            openNotification('error', 'Authentication Error', 'Please log in again.');
            navigate('/login');
            return;
        }

        // Fetch user data first
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://route.managewise.top/api/data/DUdata', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error(response.status === 404 
                        ? 'User not found. Please check your account.' 
                        : 'Authentication failed. Please log in again.');
                }

                const userData = await response.json();
                setUser(userData);
                setIsLoadingUser(false);

                // After user data is set, fetch all users data in the background
                fetchAllUsersInBackground();
            } catch (error) {
                console.error('Error fetching user data:', error);
                openNotification('error', 'Error', error.message || 'An unexpected error occurred');
                navigate('/login');
            }
        };

        // Fetch all users data in the background
        const fetchAllUsersInBackground = async () => {
            try {
                const response = await fetch('https://route.managewise.top/api/data/AllUserData', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (response.ok) {
                    const allUsersData = await response.json();
                    setAllUsers(allUsersData);
                } else {
                    console.warn('Failed to fetch all users data');
                }
            } catch (error) {
                console.warn('Error fetching all users data:', error);
                // Don't show error notification for background fetch
            }
        };

        fetchUserData();
    }, [token, navigate, setUser, setAllUsers]);

    if (isLoadingUser) {
        return (
            <div className="loading-container">
                <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    style={{ width: 200, height: 200 }}
                />
            </div>
        );
    }

    if (!user) {
        return <div>No user data available.</div>;
    }

    return (
        <div>
            <Nav />
            <div style={{ paddingTop: '10vh' }}>
                <Dashboard />
            </div>
        </div>
    );
}

export default Home;
