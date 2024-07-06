import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import Order from '../components/Order';
import '../css/AllOrders.css';
import { MdOutlineReadMore, MdOutlineDateRange ,MdBookmarkBorder } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

import { Link } from 'react-router-dom';

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
      console.log("Orders Data:", ordersData)
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
    <div className="payment-container">
      <table className="payment-container-table">
        <thead className="payment-container-thead">
          <tr>
            <th className="payment-container-th"><MdBookmarkBorder /> Order ID</th>
            <th className="payment-container-th"><FaRegUser /> User Name</th>
            <th className="payment-container-th"><MdOutlineDateRange /> Order Date</th>
            <th className="payment-container-th"><MdOutlineReadMore /> Order Info</th>
          </tr>
        </thead>
        <tbody className="payment-container-tbody">
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td className="payment-container-td">{order.order_id}</td>
              <td className="payment-container-td">{order.username}</td>
              <td className="payment-container-td">{formatDate(order.order_date)}</td>
              <td className="payment-container-td link" onClick={() => handleOrderClick(order.order_id)}>
                <Link> See Details</Link>
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
