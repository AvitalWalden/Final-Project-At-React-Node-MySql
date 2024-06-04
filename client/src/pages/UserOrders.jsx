import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

const UserOrders = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            const url = `http://localhost:3000/orders?user_id=${user.user_id}`;
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                })
                .catch(error => {
                    console.error('There was an error fetching the orders!', error);
                });
        }
    }, [user]);

    return (
        <div>
            <h1>Your Orders</h1>
            {orders.length > 0 ? (
                <ul>
                    {orders.map(order => (
                        <li key={order.order_id}>
                            <p>Order Date: {order.order_date}</p>
                            <p>Gift: {order.gift_name}</p>
                            <p>Price: {order.price}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default UserOrders;
