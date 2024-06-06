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
        <table className="order-table">
          <thead>
            <tr>
              <th>OrderGiftId</th>
              <th>OrderGiftDate</th>
              <th>Image</th>
              <th>GiftId</th>
              <th>TicketPrice</th>
              <th>UserId</th>
              <th>EmailUser</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.orderGiftId}</td>
                <td>{order.orderGiftDate}</td>
                <td><img src={order.image_url} alt={order.name} className="order-image" /></td>
                <td>{order.giftId}</td>
                <td>{order.ticketPrice}</td>
                <td>{order.userId}</td>
                <td>{order.emailUser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderManagement;
