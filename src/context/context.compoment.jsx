import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase/firebase'; // Adjust this import according to your file structure

// Create UserContext
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage if it exists
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        // Set up Firebase auth listener
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                setCurrentUser(null);
                localStorage.removeItem('currentUser');
            }
        });

        return () => unsubscribe();
    }, []);

    const value = { currentUser, setCurrentUser };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


// dont touch... its work