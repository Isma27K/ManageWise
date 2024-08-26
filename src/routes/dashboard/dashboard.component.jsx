import React, { useContext } from "react";
import { UserContext } from "../../context/context.compoment";
import { auth } from "../../utils/firebase/firebase";

const Dashboard = () => {
    const { currentUser } = useContext(UserContext);

    const logout = async () => {
        try {
            // Sign out the user from Firebase
            await auth.signOut();
    
            // Clear user data from local storage
            localStorage.removeItem('currentUser');
    
            // Optionally, you can redirect the user to a login page or home page
            window.location.href = '/'; // Adjust the redirect path as necessary
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return(
        <div className="dashboard">
            <h1>Dashboard</h1>
            {currentUser ? (
                <div>
                    <p>UID: {currentUser.uid}</p>
                    <p>Name: {currentUser.displayName || "No display name available"}</p>
                    <p>Email: {currentUser.email}</p>
                    <p>Verified: {currentUser.emailVerified ? "Yes" : "No"}</p>
                    {/* Add more fields as needed */}

                    <input type="button" value="Logout" onClick={logout} />

                </div>
            ) : (
                <p>Please log in to view your dashboard.</p>
            )}
        </div>
    );
};

export default Dashboard;
