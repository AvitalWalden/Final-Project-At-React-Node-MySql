import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../pages/UserContext';
import '../css/Order.css'; // Ensure the correct path to the CSS file

const Order = ({ orderId, onClose }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const { refreshAccessToken } = useContext(UserContext);

    useEffect(() => {
        const fetchOrderDetails = async (orderId) => {
            try {
                console.log("Fetching order details for orderId:", orderId);
                const response = await fetch(`http://localhost:3000/orders/order_id/${orderId}`, {
                    method: "GET",
                    credentials: "include"
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        console.log('Refreshing token and retrying...');
                        await refreshAccessToken();
                        return fetchOrderDetails(orderId);
                    }

                    if (response.status === 403) {
                        console.log('Invalid token. You cannot do this.');
                        throw new Error('Forbidden');
                    }
                }

                const data = await response.json();
                console.log("Fetched order details:", data);
                setOrderDetails(data);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails(orderId);
    }, [orderId, refreshAccessToken]);

    if (orderDetails === null) {
        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <div className="modal-header">
                        <h2>Order Details</h2>
                    </div>
                    <div className="modal-body">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className="modal-header">
                    <h2>Order Details</h2>
                </div>
                <div className="modal-body">
                    <div className="order-info">
                        <h3>Order Information</h3>
                        <p><strong>Order ID:</strong> {orderDetails.order_id}</p>
                        <p><strong>Order Date:</strong> {new Date(orderDetails.order_date).toLocaleDateString()}</p>
                    </div>
                    <div className="user-info">
                        <h3>User Information</h3>
                        <p><strong>Name:</strong> {orderDetails.name}</p>
                        <p><strong>Username:</strong> {orderDetails.username}</p>
                        <p><strong>Email:</strong> {orderDetails.email}</p>
                        <p><strong>Phone:</strong> {orderDetails.phone}</p>
                        <p><strong>City:</strong> {orderDetails.city}</p>
                        <p><strong>Street:</strong> {orderDetails.street}</p>
                        <p><strong>Zipcode:</strong> {orderDetails.zipcode}</p>
                    </div>
                    <div className="gifts-info">
                        <h3>Gifts</h3>
                        {orderDetails.gifts.map((gift, index) => (
                            <div key={index} className="gift-item">
                                <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                                <p><strong>Gift Name:</strong> {gift.name}</p>
                                <p><strong>Price:</strong> {gift.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;