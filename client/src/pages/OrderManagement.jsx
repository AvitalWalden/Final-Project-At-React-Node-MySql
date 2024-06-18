import React, { useContext, useState, useEffect } from 'react';
import { OrderContext } from './OrderContext';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashCan } from "react-icons/fa6";
import '../css/OrderManagement.css';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { removeFromOrder, setOrder, order, savedCartItems, setSavedCartItems } = useContext(OrderContext);
  const { user } = useContext(UserContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchSavedCartItems = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:3000/shoppingCart/${user.user_id}`);
          const data = await response.json();
          setSavedCartItems(data);
        } catch (error) {
          console.error('Error fetching saved cart items:', error);
        }
      }
    };

    fetchSavedCartItems();
  }, [user, order]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    order.forEach((gift) => {
      totalPrice += gift.price * gift.quantity;
    });
    savedCartItems.forEach((gift) => {
      totalPrice += gift.price * gift.quantity;
    });

    return totalPrice.toFixed(2);
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [order, savedCartItems]);

  const handlePaymentClick = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      navigate('/payment');
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const handleLoginCancel = () => {
    setShowLoginPrompt(false);
  };

  const handleDeleteGift = (giftId, IdentifyString) => {
    removeFromOrder(giftId, IdentifyString);
  };

  const handleQuantityChange = (giftId, newQuantity, IdentifyString) => {
    if (IdentifyString == "current") {
      const updatedOrder = order.map((item) =>
        item.gift_id === giftId ? { ...item, quantity: newQuantity } : item
      );
      setOrder(updatedOrder);
    }
    else {
      const putToDBShoppingCart = async (giftId, newQuantity) => {
        try {
          const userId = user.user_id;
          await fetch(`http://localhost:3000/shoppingCart`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, giftId, newQuantity }),
          });
          const updatedSavingCart = savedCartItems.map((item) =>
            item.gift_id === giftId ? { ...item, quantity: newQuantity } : item
          );
          setSavedCartItems(updatedSavingCart);
        } catch (error) {
          console.error('Error saving shopping cart:', error);
        }
      };
      putToDBShoppingCart(giftId, newQuantity)
    }
  };

  return (
    <div className="order-management">
      <h1>Order Management</h1>
      {order.length > 0 && (
        <div className="gift-list">
          <h2>Current Gift List</h2>
          {
            order.map((gift, index) => (
              <div key={index} className="gift-card-cart">
                <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                <h1>{gift.name}</h1>
                <h1>${gift.price}</h1>
                <input
                  type="number"
                  value={gift.quantity}
                  onChange={(e) => handleQuantityChange(gift.gift_id, parseInt(e.target.value), "current")}
                />
                <div className="tooltip">
                  <button className="btnDelete-cart" onClick={() => handleDeleteGift(gift.gift_id, "current")}>
                    <FaTrashCan />
                  </button>
                  <span className="tooltiptext">Remove item</span>
                </div>
              </div>
            ))
          }
        </div>
      )}
      {savedCartItems.length > 0 && (
        <div className="saved-cart">
          <h2>Saved Shopping Cart</h2>
          {
            savedCartItems.map((gift, index) => (
              <div key={index} className="gift-card-cart">
                <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                <h1>{gift.name}</h1>
                <h1>${gift.price}</h1>
                <input
                  type="number"
                  value={gift.quantity}
                  onChange={(e) => handleQuantityChange(gift.gift_id, parseInt(e.target.value), "saved")}
                />
                <div className="tooltip">
                  <button className="btnDelete-cart" onClick={() => handleDeleteGift(gift.gift_id, "saved")}>
                    <FaTrashCan />
                  </button>
                  <span className="tooltiptext">Remove item</span>
                </div>
              </div>
            ))
          }
        </div>
      )}

      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="summary-container">
          <p>Total Price: {totalPrice}$</p>
          <button
            className="btn-buy"
            onClick={handlePaymentClick}
            disabled={order.length === 0 && savedCartItems.length === 0}
          >
            Proceed to Payment
          </button>
        </div>
      </div>


      {showLoginPrompt && (
        <div className='modal'>
          <div className="modal-content">
            <h2>Please log in first</h2>
            <button onClick={handleLoginRedirect}>OK</button>
            <button onClick={handleLoginCancel}>Later</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
