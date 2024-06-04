import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import '../css/Gift.css';

const UserOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const url = `http://localhost:3000/orders/${user.user_id}`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setOrders(data);
          console.log(data);
          console.log(orders);

        } catch (error) {
          console.error('There was an error fetching the orders!', error);
        }
      }
    };

    fetchData();
  }, [user]);

useEffect(()=>{
    setIsLoading(false);
},[orders])

  return (
    <div>
      <h1>Your Orders</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : orders.length > 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <div className="gift-card" key={order.order_id}>
              <h1>Order Date: {order.order_date}</h1>
              <h1>Gift: {order.name}</h1>
              <h1>Price: {order.price}</h1>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;
