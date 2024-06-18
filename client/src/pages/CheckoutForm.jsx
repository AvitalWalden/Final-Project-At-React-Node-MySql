import React, { useState, useEffect, useContext } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { OrderContext } from './OrderContext';
import { UserContext } from './UserContext';
import '../css/CheckoutForm.css';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ onPrevious }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(UserContext);
  const { order,setOrder } = useContext(OrderContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState({
    cardNumber: false,
    expiryDate: false,
    cvv: false,
  });

  const handleChange = (event, field) => {
    setIsComplete({
      ...isComplete,
      [field]: event.complete,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
    try {
      setIsLoading(true);
      const orderPost = await createOrder(user.user_id, order);
      setIsLoading(false);
      if (orderPost.order_id) {
        alert('thank you for your order')
        setOrder([])
        navigate('/');
      } else {
        console.error('Failed to create order:', orderPost);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setIsLoading(false);
    }
  };

  const createOrder = async (userId, order) => {
    const formattedOrder = order.map(item => ({
      gift_id: item.gift_id,
      quantity: item.quantity,
    }));
    const response = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        order_date: new Date().toISOString().split('T')[0],
        order: formattedOrder
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    return response.json();
  };

  const isFormComplete = Object.values(isComplete).every(value => value);

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Enter Payment Details</h2>
      <div className="form-row">
        <label htmlFor="card-number-element">Card Number</label>
        <CardNumberElement 
          id="card-number-element" 
          className="card-element" 
          onChange={(event) => handleChange(event, 'cardNumber')} 
        />
      </div>
      <div className="form-row">
        <label htmlFor="card-expiry-element">Expiry Date</label>
        <CardExpiryElement 
          id="card-expiry-element" 
          className="card-element" 
          onChange={(event) => handleChange(event, 'expiryDate')} 
        />
      </div>
      <div className="form-row">
        <label htmlFor="card-cvc-element">CVV</label>
        <CardCvcElement 
          id="card-cvc-element" 
          className="card-element" 
          onChange={(event) => handleChange(event, 'cvv')} 
        />
      </div>
      <button type="button" onClick={onPrevious} className="prev-button">Previous</button>
      <button type="submit" className="pay-button" disabled={ !isFormComplete || isLoading}>
        {isLoading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

export default CheckoutForm;
