import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import Order from '../components/Order';
import '../css/AllOrders.css';

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { refreshAccessToken } = useContext(UserContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Refreshing token and retrying...');
          await refreshAccessToken();
          return fetchOrders();
        }

        if (response.status === 403) {
          console.log('Invalid token. You cannot do this.');
          throw response.error;
        }
      }

      const ordersData = await response.json();
      console.log("pi",ordersData)
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleOrderClick = (orderId) => {
    setSelectedOrder(orderId);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name</th>
            <th>Order Date</th>
            <th>Order Info</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.username}</td>
              <td>{formatDate(order.order_date)}</td>
              <td onClick={() => handleOrderClick(order.order_id)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                See Details👇
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrder && (
        <Order orderId={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default AllOrders;
