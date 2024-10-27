import { notification } from 'antd';
import { UserContext } from '../contexts/UserContext';

const token = localStorage.getItem('jwtToken');

const openNotification = (type, message, description) => {
    notification[type]({
        message,
        description,
        placement: 'topRight',
    });
};

const createFetchFunction = (setStateFunction, url, errorMessage) => {
    return async (contextValue) => {
        if (!contextValue) {
            console.error('Context value is undefined');
            openNotification('error', 'Error', 'An unexpected error occurred');
            return;
        }

        try {
            const response = await fetch(url, {
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
                    throw new Error(errorMessage);
                }
            }

            const data = await response.json();
            setStateFunction(contextValue, data);
        } catch (error) {
            console.error('Fetch error:', error);
            openNotification('error', 'Error', error.message || 'An unexpected error occurred');
        }
    };
};

const UserFetch = createFetchFunction(
    (context, data) => {
        if (context && typeof context.setUser === 'function') {
            context.setUser(data);
        } else {
            console.error('setUser is not a function in the provided context');
        }
    },
    'https://route.managewise.top/api/data/DUdata',
    'Failed to fetch user data'
);

const AllUserFetch = createFetchFunction(
    (context, data) => {
        if (context && typeof context.setAllUsers === 'function') {
            context.setAllUsers(data);
        } else {
            console.error('setAllUsers is not a function in the provided context');
        }
    },
    'https://route.managewise.top/api/data/AllUserData',
    'Failed to fetch all users'
);

const PoolFetch = createFetchFunction(
    (context, data) => {
        if (context && typeof context.setPools === 'function') {
            context.setPools(data);
        } else {
            console.error('setPools is not a function in the provided context');
        }
    },
    'https://route.managewise.top/api/data/DDdata',
    'Failed to fetch pools'
);

export { UserFetch, AllUserFetch, PoolFetch, UserContext };
