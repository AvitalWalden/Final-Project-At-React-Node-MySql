import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([]);
  const [message, setMessage] = useState('');
  const [isOrderListOpen, setIsOrderListOpen] = useState(false);
  const [savedCartItems, setSavedCartItems] = useState([]);
  const { user } = useContext(UserContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(() => {
    const storedPackage = localStorage.getItem('selectedPackage');
    return storedPackage ? JSON.parse(storedPackage) : null;
  });
  useEffect(() => {
    const storedOrder = localStorage.getItem('currentOrder');
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
  }, []);

  useEffect(() => {
    if (order.length > 0)
      localStorage.setItem('currentOrder', JSON.stringify(order));
  }, [order]);

  useEffect(() => {
    if (selectedPackage) {
      localStorage.setItem('selectedPackage', JSON.stringify(selectedPackage));
    } else {
      localStorage.removeItem('selectedPackage');
    }
  }, [selectedPackage]);

  const addToOrder = (gift, checkbox) => {
    if (selectedPackage) {
      let totalSelectedQuantity = 0;
      order.forEach((gift) => {
        if (gift.isChecked) {
          totalSelectedQuantity += gift.quantity;
        }
      });
      if (selectedPackage && totalSelectedQuantity >= selectedPackage.amount) {
        alert(`You can only select up to ${selectedPackage.amount} gifts.`);
        return;
      }
    }
    const existingGift = order.find((item) => item.gift_id === gift.gift_id);
    if (existingGift) {
      const updatedOrder = order.map((item) =>
        item.gift_id === gift.gift_id ? { ...item, quantity: item.quantity + 1, isChecked: checkbox } : item
      );
      setOrder(updatedOrder);
    } else {
      setOrder([...order, { ...gift, quantity: 1, isChecked: checkbox }]);

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
      localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
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
        selectedPackage,
        setSelectedPackage,
        totalPrice,
        setTotalPrice,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
