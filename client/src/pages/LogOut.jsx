import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { OrderContext } from './OrderContext';

const LogOut = () => {
  const { setOrder, order } = useContext(OrderContext);
  const { setUser, user } = useContext(UserContext);
  const { refreshAccessToken } = useContext(UserContext);

  const navigate = useNavigate();

  const handleUserLogout = async (logout) => {
    if (logout) {
      await saveToDBShoppingCart(); 
      setOrder([]);
      setUser(null); 
    
      navigate('/');
    } else {
      navigate('/gifts');
    }
  };
  const saveToDBShoppingCart = async () => {
    if(order.length>0){
      console.log("hereee:",order)
    const userId = user.user_id;
    const url = `http://localhost:3000/shoppingCart`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({ userId, order }),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Refreshing token and retrying...');
          await refreshAccessToken();
          return saveToDBShoppingCart();
        }

        if (response.status === 403) {
          console.log('invalid token you cannot do it...');
          throw response.error;
        }
      }
      const data = await response.json();
      await deleteToken(); 
    } catch (error) {
      console.error('Error saving to shopping cart:', error);
    }
  }else{
    return;
  }
  };

  const deleteToken = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('User successfully logged out');
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  };


  return (
    <div className="form">
      <p>Are you sure you want to logout?</p>
      <button className="logOut" onClick={() => handleUserLogout(true)}>
        Yes
      </button>
      <button className="logOut" onClick={() => handleUserLogout(false)}>
        No
      </button>
    </div>
  );
};

export default LogOut;
