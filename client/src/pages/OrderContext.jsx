import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([]);
  const [message, setMessage] = useState('');
  const [isOrderListOpen, setIsOrderListOpen] = useState(false);
  const [savedCartItems, setSavedCartItems] = useState([]);

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

  const removeFromOrder = (giftId) => {
    const updatedOrder = order.filter((item) => item.gift_id !== giftId);
    setOrder(updatedOrder);

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
