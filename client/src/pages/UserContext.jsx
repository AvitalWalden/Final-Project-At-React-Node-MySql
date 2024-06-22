import React, { createContext, useState, useEffect } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const accessToken = getCookie("jwt_accessToken");
  //   const refreshToken = getCookie('jwt_refreshToken');

  //   if (!refreshToken) {
  //     setLoading(false);
  //     console.log("/home");
  //   }
  //   else {
  //     if (!accessToken) {
  //       refreshAccessToken().then(() => {
  //         fetchUser();
  //       });
  //     } else {
  //       fetchUser();
  //     }
  //   }
   
  // }, []);

  // const getCookie = (name) => {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(';').shift();
  // }

  // const fetchUser = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/users', {
  //       method: 'GET',
  //       credentials: 'include'
  //     });

  //     if (response.status === 401) {
  //       return <Navigate to="/login" />;
  //     }

  //     const data = await response.json();
  //     setUser(data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false);
  //   }
  // };

  // const fetchAccessToken = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/refresh', {
  //       method: 'GET',
  //       credentials: 'include'
  //     });
  //     if (response.status === 401) {
  //       throw new Error('Unauthorized, login');
  //     }
  //     const data = await response.json();
  //     return data.accessToken;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  const refreshAccessToken = async () => {
    try {
      console.log('sendRefreshToken');

      const response = await fetch('http://localhost:3000/refresh', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };  
 

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <UserContext.Provider value={{ user, setUser, refreshAccessToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
