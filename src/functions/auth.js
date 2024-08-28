// auth.js
export const isAuthenticated = () => {
    // Check if user is authenticated
    return localStorage.getItem('currentUser') !== null;
  };
  