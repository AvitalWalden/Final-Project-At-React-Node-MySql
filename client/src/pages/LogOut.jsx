import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { OrderContext } from './OrderContext';

const LogOut = () => {
  const { setOrder, order, setSavedCartItems } = useContext(OrderContext);
  const { setUser, user } = useContext(UserContext);
  const { refreshAccessToken } = useContext(UserContext);

  const navigate = useNavigate();

  const handleUserLogout = async (logout) => {
    if (logout) {
      await saveToDBShoppingCart();
      setOrder([]);
      setSavedCartItems([]);
      localStorage.removeItem('selectedPackage');
      await deleteToken();
      setUser(null);
      navigate('/');
    } else {
      navigate('/gifts');
    }
  };
  const saveToDBShoppingCart = async () => {
    if (order.length > 0) {
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
            return;
          }
        }
        else {
          localStorage.removeItem('currentOrder');
          await response.json();
        }
      } catch (error) {
         console.log('Error saving to shopping cart:', error);
      }
    } else {
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
      else {
        console.log('User successfully logged out');
      }
    } catch (error) {
      console.log('Error logging out user:', error);
    }
  };



  return (
    <div className="container mt-5">
      <div className="alert alert-info text-center" role="alert">
        <h2>Are you sure you want to logout?</h2>
        <button className="btn btn-primary me-2" onClick={() => handleUserLogout(true)}>
          Yes
        </button>
        <button className="btn btn-primary me-2" onClick={() => handleUserLogout(false)}>
          No
        </button>
      </div>
    </div>
  );
};

export default LogOut;
