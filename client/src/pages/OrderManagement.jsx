import React, { useContext, useState, useEffect } from 'react';
import { OrderContext } from './OrderContext';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashCan } from "react-icons/fa6";
import '../css/OrderManagement.css';

const OrderManagement = () => {
  const { removeFromOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  const { setOrder, order,temporaryCart,setTemporaryCart,savedCartItems,setSavedCartItems } = useContext(OrderContext);
  const { user } = useContext(UserContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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
      } else {
        setSavedCartItems(order);
      }
    };

    fetchSavedCartItems();
  }, [user, order]);

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

  const handleDeleteGift = (giftId) => {
    removeFromOrder(giftId);
  };

  const handleQuantityChange = (giftId, newQuantity) => {
    const updatedOrder = order.map((item) =>
      item.gift_id === giftId ? { ...item, quantity: newQuantity } : item
    );
    setOrder(updatedOrder);
   
  };


  return (
    <div className="order-management">
      <h1>Shopping Cart</h1>
      {order.length === 0 && savedCartItems.length === 0 ? (
        <p>No gifts added to the order.</p>
      ) : (
        <>
          <div className="gift-list">
            {order.length > 0 && (
              <>
                <h2>Current Order:</h2>
                {order.map((gift, index) => (
                  <div key={index} className="gift-card-cart">
                    <h1>{gift.name}</h1>
                    <h1>{gift.price}$</h1>
                    <input
                      type="number"
                      value={gift.quantity}
                      onChange={(e) => handleQuantityChange(gift.gift_id, parseInt(e.target.value))}
                    />
                    <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                    <div className="tooltip">
                      <button className="btnDelete-cart" onClick={() => handleDeleteGift(gift.gift_id)}>
                        <FaTrashCan />
                      </button>
                      <span className="tooltiptext">Remove item</span>
                    </div>
                  </div>
                ))}
              </>
            )}
            {savedCartItems.length > 0 && (
              <>
               <br></br>
                <h2>You also added:</h2>
                {savedCartItems.map((gift, index) => (
                  <div key={index} className="gift-card-cart">
                    <h1>{gift.name}</h1>
                    <h1>{gift.price}$</h1>
                    <input
                      type="number"
                      value={gift.quantity}
                      onChange={(e) => handleQuantityChange(gift.gift_id, parseInt(e.target.value))}
                    />
                    <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                    <div className="tooltip">
                      <button className="btnDelete-cart" onClick={() => handleDeleteGift(gift.gift_id)}>
                        <FaTrashCan />
                      </button>
                      <span className="tooltiptext">Remove item</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
      <button className="btn-buy" onClick={handlePaymentClick} disabled={order.length === 0 && savedCartItems.length === 0}>
        Buy here
      </button>
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
