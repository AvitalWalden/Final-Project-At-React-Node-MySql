import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('your-publishable-key-here');

const Checkout = ({ onPrevious }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm onPrevious={onPrevious}/>
  </Elements>
);

export default Checkout;
