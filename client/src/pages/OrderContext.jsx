import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([]);
  const [message, setMessage] = useState('');

  const addToOrder = (gift) => {
    const existingGiftIndex = order.findIndex((item) => item.gift_id === gift.gift_id);
    if (existingGiftIndex !== -1) {
      const updatedOrder = [...order];
      updatedOrder[existingGiftIndex].quantity += 1;
      setOrder(updatedOrder);
    } else {
      setOrder([...order, { ...gift, quantity: 1 }]);
    }

    setMessage(`Gift "${gift.name}" added to the order!`);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const removeFromOrder = (giftId) => {
    const updatedOrder = order.filter((item) => item.gift_id !== giftId);
    setOrder(updatedOrder);

    setMessage('Gift removed from the order!');
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <OrderContext.Provider value={{ order, addToOrder, removeFromOrder, message }}>
      {children}
    </OrderContext.Provider>
  );
};
