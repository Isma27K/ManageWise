import React, { createContext, useState } from 'react';

// Create a context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [other, setOther] = useState(null);
  const [pools, setPools] = useState([]); // Initialize as an empty array
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Add a console.log here to check the user data
  //console.log('UserContext user:', user);
  //console.log('UserContext allUsers:', allUsers);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      allUsers, 
      setAllUsers, 
      other, 
      setOther, 
      pools, 
      setPools,
      globalSearchTerm,
      setGlobalSearchTerm
    }}>
      {children}
    </UserContext.Provider>
  );
};
