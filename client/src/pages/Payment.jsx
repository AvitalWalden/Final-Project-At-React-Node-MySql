import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import UserDetailsPayment from './UserDetailsPayment';
import PaymentDetailsForm from './PaymentDetailsForm';
import Checkout from "./Checkout";
import '../css/Payment.css'; 

const Payment = () => {
  const { user } = useContext(UserContext);
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  return (
    <div>
      <div className="step-indicator">
        <span className={`dot ${step === 1 ? 'active' : ''}`}></span>
        <span className={`dot ${step === 2 ? 'active' : ''}`}></span>
      </div>

      {step === 1 && <UserDetailsPayment user={user} onNext={handleNext} />}
      {step === 2 && <Checkout onPrevious={handlePrevious} />}
    </div>
  );
};

export default Payment;
