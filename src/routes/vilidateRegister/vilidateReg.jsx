import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from '../register/register.component';
import { notification } from 'antd';
import Lottie from "lottie-react";
import loadingAnimation from '../../asset/gif/loading.json'; // You'll need to add this JSON file

const ValidateRegister = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isInvitationValid, setIsInvitationValid] = useState(false);

    const openNotification = (type, message, description) => {
        notification[type]({
            message,
            description,
            placement: 'topRight',
        });
    };

    useEffect(() => {
        const checkInvitation = async () => {
            // Extract the invitation from the query string
            const params = new URLSearchParams(window.location.search);
            const invitation = params.get('invitation');

            if (!invitation) {
                openNotification('error', 'Error', 'Invitation link is missing');
                navigate('/login');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/auth/checkLink', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: invitation
                    }),
                });
        
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Invitation link is invalid');
                    } else if (response.status === 401) {
                        throw new Error('Invitation link is expired');
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                }

                setIsInvitationValid(true);
            } catch (error) {
                console.error('Error fetching user data:', error);
                openNotification('error', 'Error', error.message || 'An unexpected error occurred');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkInvitation();
    }, [navigate]);

    return (
        <>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Lottie animationData={loadingAnimation} style={{ width: 200, height: 200 }} />
                </div>
            ) : isInvitationValid ? (
                <Register />
            ) : (
                <div>Invitation link is invalid</div>
            )}
        </>
    );
}

export default ValidateRegister;
