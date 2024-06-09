import React, { useContext, useState } from 'react';
import { OrderContext } from './OrderContext';
import { UserContext } from './UserContext';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { order, message } = useContext(OrderContext);
  const { user } = useContext(UserContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentClick = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      try {
        setIsLoading(true);
        const orderPost = await createOrder(user.user_id, order);
        setIsLoading(false);
        navigate('/payment', { state: { orderPost } });
      } catch (err) {
        console.error('Error creating order:', err);
        setIsLoading(false);
      }
    }
  };

  const createOrder = async (userId, order) => {
    const formattedOrder = order.map(item => ({
      gift_id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url
    }));

    const response = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        order_date: new Date().toISOString().split('T')[0],
        order: formattedOrder
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    return response.json();
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
      {order.length === 0 ? (
        <p>No gifts added to the order.</p>
      ) : (
        <>
          <ul>
            {order.map((order, index) => (
              <div key={index} className="gift-card">
                <h1>{order.name}</h1>
                <h1>{order.price}</h1>
                <img src={order.image_url} alt={order.name} />
              </div>
            ))}
          </ul>
          <button onClick={handlePaymentClick} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Buy here'}
          </button>
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
