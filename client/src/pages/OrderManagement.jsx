import React, { useContext } from 'react';
import { OrderContext } from './OrderContext';
import '../App.css';

const OrderManagement = () => {
  const { orders, message } = useContext(OrderContext);

  return (
    <div>
      <h1>Order Management</h1>
      {message && <p className="confirmation-message">{message}</p>}
      {orders.length === 0 ? (
        <p>No gifts added to the order.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <div key={index} className="gift-card">
              <h1>{order.name}</h1>
              <h1>{order.price}</h1>
              <img src={order.image_url} alt={order.name} />
            </div>

          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderManagement;
