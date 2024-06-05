import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  const addOrder = (gift) => {
    setOrders([...orders, gift]);
    setMessage(`Gift "${gift.name}" added to the order!`);
    setTimeout(() => {
      setMessage('');
    }, 3000); 
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, message }}>
      {children}
    </OrderContext.Provider>
  );
};
