import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([]);
  const [message, setMessage] = useState('');

  const addOrder = (gift) => {
    setOrder([...order, gift]);
    setMessage(`Gift "${gift.name}" added to the order!`);
    setTimeout(() => {
      setMessage('');
    }, 3000); 
  };

  return (
    <OrderContext.Provider value={{ order, addOrder, message }}>
      {children}
    </OrderContext.Provider>
  );
};
