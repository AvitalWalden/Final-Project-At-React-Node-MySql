import React, { createContext, useState, useEffect,useContext } from 'react';
import { UserContext } from './UserContext';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([]);
  const [message, setMessage] = useState('');
  const [isOrderListOpen, setIsOrderListOpen] = useState(false);
  const [savedCartItems, setSavedCartItems] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const storedOrder = localStorage.getItem('currentOrder');
    console.log("ggg",storedOrder)
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentOrder', JSON.stringify(order));
  }, [order]);

  const addToOrder = (gift) => {
    const existingGift = order.find((item) => item.gift_id === gift.gift_id);
    if (existingGift) {
      const updatedOrder = order.map((item) =>
        item.gift_id === gift.gift_id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setOrder(updatedOrder);
    } else {
      setOrder([...order, { ...gift, quantity: 1 }]);
    }
    setIsOrderListOpen(true);
    setMessage(`Gift "${gift.name}" added to the order!`);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const removeFromOrder = (giftId, IdentifyString) => {
    if (IdentifyString == "current") {
      const updatedOrder = order.filter((item) => item.gift_id !== giftId);
      setOrder(updatedOrder);
    }
    else {
    
      const removeFromSavedShoppingCart = async (giftId) => {
        try {
          const userId = user.user_id; 
      
          await fetch(`http://localhost:3000/shoppingCart/${userId}/${giftId}`, {
            method: 'DELETE',
            credentials: "include",
          });
      
          setSavedCartItems(savedCartItems.filter(item => item.gift_id !== giftId));
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      };
      removeFromSavedShoppingCart(giftId);
      
    }
    setMessage('Gift removed from the order!');
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <OrderContext.Provider
      value={{
        setOrder,
        order,
        addToOrder,
        removeFromOrder,
        message,
        isOrderListOpen,
        setIsOrderListOpen,
        savedCartItems,
        setSavedCartItems,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
