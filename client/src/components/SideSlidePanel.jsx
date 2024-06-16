import React from 'react';
import '../css/SideSlidePanel.css';

const SideSlidePanel = ({ isOpen, orderGifts, onClose }) => {
  return (
    <div className={`side-slide-panel ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>Close</button>
      <h2>Order Gifts</h2>
      <ul>
        {orderGifts.map((gift, index) => (
          <li key={index}>
            <img src={gift.image_url} alt={gift.name} />
            <div className="gift-info">
              <p>{gift.name}</p>
              <p>{gift.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideSlidePanel;
