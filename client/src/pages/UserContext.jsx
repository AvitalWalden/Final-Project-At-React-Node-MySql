import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const refreshAccessToken = async () => {
    try {

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

      return data.accessToken;

    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/refreshment', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        });


        if (response.status === 401) {
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to refresh user');
        }

        const data = await response.json();
        
        if (!data) {
          throw new Error('Log in first');
        }

        setUser(data);

      } catch (error) {
        console.error('Error during refresh page:', error);

      }
    };

    refreshUser();
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser, refreshAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;



