import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import '../css/UserOrders.css'
const UserOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user && user.user_id) {
      fetch(`http://localhost:3000/orders/user_id/${user.user_id}`, {
        method: "GET",
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {

          setOrders(data);
        })
        .catch(error => console.error('Error fetching orders:', error));
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <p>Please log in to view your orders.</p>
        <br />
        <Link to='/login'>Log in here</Link>
      </>
    );
  }

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order, key) => (
            <div className="order-card" key={key}>
              <h2>Order Date: {new Date(order.order_date).toLocaleDateString()}</h2>

              <h3>Gift: {order.name}</h3>
              <h3>Price: {order.price}</h3>
            </div>

          ))}
        </ul>
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
  );
};

export default UserOrders;
