import React from 'react';
import '../css/SideSlidePanel.css';

const SideSlidePanel = ({ orders, isOpen, onClose }) => {
    return (
        <div className={`order-list ${isOpen ? 'open' : ''}`}>
            <div className="header">
                <h2>Orders</h2>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
            <ul className="orders">
                {orders.map((gift, index) => (
                    <li key={index}>
                        <div className="gift-info">
                            <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                            <p>Name:{gift.name}</p>
                            <p>Price:{gift.price}</p>
                            <p>Quantity:{gift.quantity}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideSlidePanel;
