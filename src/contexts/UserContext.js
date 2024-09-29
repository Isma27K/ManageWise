import React, { createContext, useState } from 'react';

// Create a context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [other, setOther] = useState(null);


  return (
    <UserContext.Provider value={{ user, setUser, other, setOther }}>
      {children}
    </UserContext.Provider>
  );
};
