import React, { createContext, useState } from 'react';

// Create a context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [other, setOther] = useState(null);
  const [pools, setPools] = useState([]); // Initialize as an empty array

  //console.log('pools', pools);


  return (
    <UserContext.Provider value={{ user, setUser, allUsers, setAllUsers, other, setOther, pools, setPools }}>
      {children}
    </UserContext.Provider>
  );
};
