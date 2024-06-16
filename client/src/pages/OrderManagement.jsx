import React, { useContext, useState } from 'react';
import { OrderContext } from './OrderContext';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashCan } from "react-icons/fa6";
import '../css/OrderManagement.css';

const OrderManagement = () => {
  const { removeFromOrder } = useContext(OrderContext);
  const navigate = useNavigate();
  const { setOrder, order } = useContext(OrderContext);
  const { user } = useContext(UserContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handlePaymentClick = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      navigate('/payment')
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
      {order.length === 0 ? (
        <p>No gifts added to the order.</p>
      ) : (
        <>
          <div className="gift-list">
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
          </div>
        </>
      )}
      <button className="btn-buy" onClick={handlePaymentClick} disabled={order.length === 0}>
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
