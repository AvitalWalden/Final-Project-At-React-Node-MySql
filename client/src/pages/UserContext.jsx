import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const refreshAccessToken = async () => {
    try {
      console.log('sendRefreshToken');
      const response = await fetch('http://localhost:3000/refresh', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      console.log(data);
      return data.accessToken; // Assuming you want to return the new accessToken

    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error; // Rethrow the error to be handled where refreshAccessToken is called
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
