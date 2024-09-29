import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Nav from "../../components/nav/nav.component";
import Dashboard from "../../components/dashboard/dashboard.component";
import Footer from '../../components/footer/footer.component.jsx';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import loadingAnimation from '../../asset/gif/loading.json'; // Make sure this JSON file exists

const Home = () => {
    const { user, setUser, allUsers, setAllUsers, setPools } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('jwtToken');

    const openNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
            placement: 'topRight',
        });
    };

    useEffect(() => {
        // Redirect to login if there's no token
        if (!token) {
            console.error('No JWT token found');
            openNotification('error', 'Authentication Error', 'Please log in again.');
            navigate('/login');
            return; // Exit early to avoid fetching user data
        }

        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/data/DUdata', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('User not found. Please check your account.');
                    } else if (response.status === 401) {
                        throw new Error('Authentication failed. Please log in again.');
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                openNotification('error', 'Error', error.message || 'An unexpected error occurred');
                navigate('/login');
            }
        };

        const fetchPools = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/data/DDdata', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    openNotification('error', 'Error', 'Failed to fetch pools');
                    return;
                }

                const data = await response.json();
                setPools(data);
            }catch (error) {
                console.error('Error fetching pools:', error);
                openNotification('error', 'Error', error.message || 'An unexpected error occurred');
                navigate('/login');
            }
        }

        const fetchAllUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/data/AllUserData', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    openNotification('error', 'Error', 'Failed to fetch all users');
                    return;
                }

                const data = await response.json();
                setAllUsers(data);
            } catch (error) {
                console.error('Error fetching all users:', error);
                openNotification('error', 'Error', error.message || 'An unexpected error occurred');
                navigate('/login');
            }finally {
                setIsLoading(false); // Ensure loading state is set to false after fetching
            }
        };

        fetchUser(); // Fetch user data
        fetchPools(); // Fetch all users data
        fetchAllUsers(); // Fetch all users data
    }, [token, navigate, setUser, setAllUsers, setPools]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Lottie animationData={loadingAnimation} style={{ width: 200, height: 200 }} />
            </div>
        );
    }

    if (!user || !allUsers) {
        return <div>No user data available.</div>;
    }

    return (
        <div>
            <Nav />
            <div style={{ paddingTop: '10vh' }}>
                <Dashboard />
            </div>
            <Footer />
        </div>
    );
}

export default Home;
