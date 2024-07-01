import React from 'react';
import '../css/OrderSummary.css';

const OrderSummary = ({ finalOrder, totalPrice }) => {
  return (
    <div className="order-summary2">
      <h3>Order Summary</h3>
      <ul>
        {finalOrder.map((item, index) => (
          <li key={index}>
            <span>{item.name}</span>
            <span id='giftPrice'>${parseFloat(item.price).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <h4>Total: <span>${parseFloat(totalPrice).toFixed(2)}</span></h4>
    </div>
  );
};

export default OrderSummary;
