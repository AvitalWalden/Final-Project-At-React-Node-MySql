import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import '../css/Gift.css';

const UserOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState();

  useEffect(() => {
    const url = `http://localhost:3000/orders/${user.user_id}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data !== null && typeof data === 'object') {
          setOrders([data]);
        }
      })
      .catch(error => console.error('Error fetching orders:', error));

  }, []);

  return (
    <div>
      <h1>Your Orders</h1>
      <ul>
        {orders != null && orders.map((order) => (
          <div className="gift-card" key={order.order_id}>
            <h1>Order Date: {order.order_date}</h1>
            <h1>Gift: {order.name}</h1>
            <h1>Price: {order.price}</h1>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserOrders;
