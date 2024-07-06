import React from 'react';
import '../css/Package.css'; 
import { ImCancelCircle } from "react-icons/im";

const Package = ({ packageDetails, onClose, onStartShopping }) => {
  return (
    <div className="modal-package-overlay">
      <div className="modal-package">
      <br/>
        <h2>{packageDetails.name}</h2>
        <br/>
        <p>{packageDetails.description}</p>
        <p>The amount of gifts that can be selected:<span>{packageDetails.amount}</span></p>
        <p>Price: <span>{packageDetails.price}$</span></p>
        <button onClick={onStartShopping}>Start Shopping</button>
        <button className="cancel" onClick={onClose}><ImCancelCircle /></button>
      </div>
    </div>
  );
};

export default Package;
