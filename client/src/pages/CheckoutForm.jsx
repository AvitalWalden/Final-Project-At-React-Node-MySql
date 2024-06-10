import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../css/CheckoutForm.css';

const CheckoutForm = ({ onPrevious }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

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
      // Send the paymentMethod.id to your server to complete the payment
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Enter Payment Details</h2>
      <div className="form-row">
        <label htmlFor="card-number-element">Card Number</label>
        <CardNumberElement id="card-number-element" className="card-element" />
      </div>
      <div className="form-row">
        <label htmlFor="card-expiry-element">Expiry Date</label>
        <CardExpiryElement id="card-expiry-element" className="card-element" />
      </div>
      <div className="form-row">
        <label htmlFor="card-cvc-element">CVV</label>
        <CardCvcElement id="card-cvc-element" className="card-element" />
      </div>
      <button type="button" onClick={onPrevious} className="prev-button">Previous</button>
      <button type="submit" className="pay-button" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
