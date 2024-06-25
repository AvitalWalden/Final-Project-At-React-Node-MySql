import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import '../css/UserOrders.css'

const UserOrders = () => {
  const { user, refreshAccessToken } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const handleOrders = () => {
      if (user && user.user_id) {
        fetch(`http://localhost:3000/orders/user_id/${user.user_id}`, {
          method: "GET",
          credentials: "include"
        })
          .then(async response => {
            if (!response.ok) {
              if (response.status === 401) {
                console.log('Refreshing token and retrying...');
                await refreshAccessToken();
                return handleOrders();
              }
              if (response.status === 402) {
                console.log('No acsses...');
                throw response.error;

              }
              if (response.status === 403) {
                console.log('invalid token you cannot do it...');
                throw response.error;
              }
            }
            return await response.json();
          })
          .then(data => {
            setOrders(data);
          })
          .catch(error => console.error('Error fetching orders:', error));
      }
    }
    handleOrders();
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
      {orders && orders.length > 0 ? (
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
