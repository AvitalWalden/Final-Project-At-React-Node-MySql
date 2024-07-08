import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/EndOrder.css'; // Make sure to create and style this CSS file for custom animations

const EndOrder = () => {
  return (
    <div className="thank-you-modal-container">
      <div className="thank-you-modal-dialog">
        <div className="thank-you-modal-content bg-lightblue">
          <div className="thank-you-modal-body text-center">
            <div className="animation-container">
              <div className="animation-box">
                <i className="fas fa-heart fa-3x"></i>
              </div>
            </div>
            <h2 className="my-3">Thank You for Your Order!</h2>
            <p>Your order has been successfully placed and will be processed soon.</p>
            <p>We appreciate your generosity and support for our cause.</p>
            <p>Together, we are making a difference and helping those in need.</p>
            <p>If you have any questions or need further assistance, please feel free to contact us.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndOrder;
