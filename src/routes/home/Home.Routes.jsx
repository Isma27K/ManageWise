import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Nav from "../../components/nav/nav.component";
import Dashboard from "../../components/dashboard/dashboard.component";
import Footer from '../../components/footer/footer.component.jsx';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import loadingAnimation from '../../asset/gif/loading.json'; // You'll need to add this JSON file

const Home = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    
    const openNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
            placement: 'topRight',
        });
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.error('No JWT token found');
                openNotification('error', 'Authentication Error', 'Please log in again.');
                navigate('/login');
                return;
            }

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
            } finally {
                // Add a 3-second delay supaya kau boleh tangga nya pun LODING
                //await new Promise(resolve => setTimeout(resolve, 3000));
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [setUser, navigate]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Lottie animationData={loadingAnimation} style={{ width: 200, height: 200 }} />
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
            <Footer />
        </div>
    )
}

export default Home;
