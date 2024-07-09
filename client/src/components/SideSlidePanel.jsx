import React, { useEffect } from 'react';
import '../css/SideSlidePanel.css';
import image from '../images/image.png';

const SideSlidePanel = ({ orders, isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <div className={`order-list ${isOpen ? 'open' : ''}`}>
            <div className="modal-header bg-info text-white">
                <h5 className="modal-title" id="exampleSideModal1">Product in the cart</h5>
                <button type="button" className="btn-close btn-close-white" data-mdb-dismiss="modal" aria-label="Close" onClick={onClose}></button>
            </div>
            <ul className="orders">
                {orders.length === 0 ? (
                    <>
                        <img className='emptyCart' src={image} alt="empty cart" />
                        <h1>Your shopping cart is empty, go shopping...</h1>
                    </>
                ) : (
                    orders.map((gift, index) => (
                        <li key={index}>
                            <div className="gift-info">
                                <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                                <p>Name: {gift.name}</p>
                                <p>Price: {gift.price}</p>
                                <p>Quantity: {gift.quantity}</p>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default SideSlidePanel;
