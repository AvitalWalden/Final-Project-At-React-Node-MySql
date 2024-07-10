import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserOrders.css';

const UserOrders = () => {
  const { user, refreshAccessToken } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user && user.user_id) {
          const response = await fetch(`http://localhost:3000/orders/user_id/${user.user_id}`, {
            method: "GET",
            credentials: "include"
          });
          if (!response.ok) {
            if (response.status === 401) {
              console.log('Refreshing token and retrying...');
              await refreshAccessToken();
              return fetchOrders();
            }
            throw new Error('Failed to fetch orders.');
          }
          const data = await response.json();
          const groupedOrders = groupOrdersById(data);
          setOrders(groupedOrders);
        }
      } catch (error) {
         console.log('Error fetching orders:', error);
        setError(error.message);
      }
    };

    fetchOrders();
  }, [user]);

  const groupOrdersById = (orders) => {
    const groupedOrders = {};
    orders.forEach(order => {
      const orderId = order.order_id;
      if (groupedOrders[orderId]) {
        groupedOrders[orderId].push(order);
      } else {
        groupedOrders[orderId] = [order];
      }
    });
    return Object.values(groupedOrders);
  };

  const calculateTotalPrice = (groupedOrder) => {
    const total = groupedOrder.reduce((sum, order) => {
      return sum + (parseFloat(order.price) * order.quantity);
    }, 0);
    const totalWithTax = total * 1.15;
    return totalWithTax.toFixed(2);
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info text-center" role="alert">
          <h2>No user found</h2>
          <p>Please log in to view your orders.</p>
          <Link to="/login">Log here</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
     <br/>
     <br/>
      {error ? (
        <p className="text-center">{error}</p>
      ) : (
        <>
          {orders && orders.length > 0 ? (
            <div className="row">
              {orders.map((groupedOrder, index) => (
                <div className="col-md-6 mb-3" key={index}>
                  <div className="card order-card gradient-custom">
                    <div className="card-body">
                      <h2 className="card-title">Order Date: {new Date(groupedOrder[0].order_date).toLocaleDateString()}</h2>
                      <ul>
                        {groupedOrder.map((order, key) => (
                          <li key={key} className="gift-item">
                            <span className="gift-name">Gift: {order.name} </span>
                            <span className="gift-price">&nbsp;Price: {order.price} quantity: {order.quantity}</span>
                            {key < groupedOrder.length - 1 && <hr className="gift-separator" />}
                          </li>
                        ))}
                      </ul>
                      <hr className="gift-separator" />
                      <h3 className="card-subtitle mt-3">Total Price: {calculateTotalPrice(groupedOrder)}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="container mt-5">
            <div className="alert alert-info text-center" role="alert">
              <h2>You have no orders.</h2>
              <Link to="/gifts">Go shopping!</Link>
            </div>
          </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserOrders;
