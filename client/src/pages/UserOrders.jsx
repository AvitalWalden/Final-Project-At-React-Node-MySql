import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState();

  useEffect(() => {
    if (user && user.user_id) {
      const url = `http://localhost:3000/orders/user_id/${user.user_id}`
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
    }
  }, [user]);

  if (!user) {
    return (<>
      <p>Please log in to view your orders.</p>
      <br></br>
      <Link to='/login'>Log here</Link>
    </>
    )
  }

  return (
    <div>
      <h1>Your Orders</h1>
      {orders && orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <div className="gift-card" key={order.order_id}>
              <h1>Order Date: {order.order_date}</h1>
              <h1>Gift: {order.name}</h1>
              <h1>Price: {order.price}</h1>
            </div>
          ))}
        </ul>
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
  );
};

export default Profile;
