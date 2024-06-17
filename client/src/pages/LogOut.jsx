import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { OrderContext } from './OrderContext';

const LogOut = () => {
  const { setOrder,order} = useContext(OrderContext);
  const { setUser,user } = useContext(UserContext);

  const navigate = useNavigate();

  const handleUserLogout = (logout) => {
    if (logout) {
      saveToDBShoppingCart(); 
      setUser(null);
      navigate('/gifts');
    } else {
      navigate('/gifts');
    }
  };
  const saveToDBShoppingCart = async () => {
    try {
      const userId = user.user_id; 
      await fetch(`http://localhost:3000/shoppingCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, order }),
      });

      setOrder([]); 
    } catch (error) {
      console.error('Error saving shopping cart:', error);
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
