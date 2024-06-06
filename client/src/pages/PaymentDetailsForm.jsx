import React, { useState } from 'react';

const PaymentDetailsForm = ({ onPrevious }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Payment processing logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Payment Details</h2>
      <label>
        Card Number:
        <input type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handleChange} />
      </label>
      <label>
        Expiry Date:
        <input type="text" name="expiryDate" value={paymentDetails.expiryDate} onChange={handleChange} />
      </label>
      <label>
        CVV:
        <input type="text" name="cvv" value={paymentDetails.cvv} onChange={handleChange} />
      </label>
      <button type="button" onClick={onPrevious}>Previous</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PaymentDetailsForm;
