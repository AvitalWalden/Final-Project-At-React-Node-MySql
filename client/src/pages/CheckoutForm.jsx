import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../css/CheckoutForm.css'; // ייבא קובץ CSS עם העיצוב

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // שלחו את ה-paymentMethod.id לשרת שלכם להשלמת התשלום
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-row">
        <label htmlFor="card-element">
          Credit or debit card
        </label>
        <CardElement id="card-element" />
      </div>
      <button type="submit" className="pay-button" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
