import React, { useContext, useState } from 'react';
import { OrderContext } from './OrderContext';
import { UserContext } from './UserContext';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { orders, message } = useContext(OrderContext);
  const { user } = useContext(UserContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); 

  const handlePaymentClick = (e) => {
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

  return (
    <div>
      <h1>Order Management</h1>
      {message && <p className="confirmation-message">{message}</p>}
      {orders.length === 0 ? (
        <p>No gifts added to the order.</p>
      ) : (
        <>
          <ul>
            {orders.map((order, index) => (
              <div key={index} className="gift-card">
                <h1>{order.name}</h1>
                <h1>{order.price}</h1>
                <img src={order.image_url} alt={order.name} />
              </div>
            ))}
          </ul>
          <button onClick={handlePaymentClick}>Buy here</button>
        </>
      )}

      {showLoginPrompt && (
        <div className="modal">
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
