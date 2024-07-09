import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
      console.log('Error refreshing token:', error);
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
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Log in first');
            navigate('/login')
            return;
          }
          throw new Error('Failed to refresh user');
        }
        else {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.log('Error during refresh page:', error);
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



