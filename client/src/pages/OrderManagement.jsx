import React, { useContext, useState, useEffect } from 'react';
import { OrderContext } from './OrderContext';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashCan } from "react-icons/fa6";
import '../css/OrderManagement.css';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { removeFromOrder, setOrder, order, savedCartItems, setSavedCartItems, selectedPackage, setSelectedPackage,totalPrice,setTotalPrice } = useContext(OrderContext);
  const { user } = useContext(UserContext);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchSavedCartItems = async () => {

      if (user) {
        try {
          const response = await fetch(`http://localhost:3000/shoppingCart/${user.user_id}`, {
            method: "GET",
            credentials: "include"
          });
          const data = await response.json();
          setSavedCartItems(data);
          savedCartItems.forEach((gift) => {
            [{ ...gift, isChecked: false }]
          });
        } catch (error) {
          console.error('Error fetching saved cart items:', error);
        }
      }
    };

    fetchSavedCartItems();
  }, [user, order]);

  const calculateTotalPrice = () => {
    let totalPrice = selectedPackage ? parseFloat(selectedPackage.price) : 0;
    if (totalPrice == 0) {
      order.forEach((gift) => {
        if (gift.isChecked) {
          totalPrice += gift.price * gift.quantity;
        }
      });

      savedCartItems.forEach((gift) => {
        if (gift.isChecked) {
          totalPrice += gift.price * gift.quantity;
        }
      });
    }

    return totalPrice.toFixed(2);
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [order, savedCartItems, selectedPackage]);

  const handlePaymentClick = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      navigate('/payment');
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  const handleLoginCancel = () => {
    setShowLoginPrompt(false);
  };

  const handleDeleteGift = (giftId, IdentifyString) => {
    removeFromOrder(giftId, IdentifyString);
  };
  const handleCheckboxChange = (giftId, IdentifyString) => {
    if (IdentifyString == "current") {
      const updatedOrder = order.map((item) =>
        item.gift_id === giftId ? { ...item, isChecked: !item.isChecked } : item
      );
      setOrder(updatedOrder);
    } else {
      console.log("saved")
      const updatedShoppingCart = savedCartItems.map((item) =>
        item.gift_id === giftId ? { ...item, isChecked: !item.isChecked } : item
      );
      setSavedCartItems(updatedShoppingCart);
    }
    calculateTotalPrice();
  };
  const handleDeletePackage = () => {
    setSelectedPackage(null)
    calculateTotalPrice();
  }
  const handleQuantityChange = (giftId, change, IdentifyString) => {
    if (IdentifyString === "current") {
      if (selectedPackage) {
        let totalSelectedQuantity = 0;
        order.forEach((gift) => {
          if (gift.isChecked) {
            totalSelectedQuantity += gift.quantity;
          }
        });
        if (totalSelectedQuantity + change > selectedPackage.amount) {
          alert(`You can only select up to ${selectedPackage.amount} gifts.`);
          return;
        }
      }
      const updatedOrder = order.map((item) =>
        item.gift_id === giftId ? { ...item, quantity: item.quantity + change } : item
      );
      setOrder(updatedOrder);
    } else {
      const putToDBShoppingCart = async (giftId, change) => {
        try {
          const userId = user.user_id;
          const currentItem = savedCartItems.find(item => item.gift_id === giftId);
          const newQuantity = currentItem.quantity + change;

          if (newQuantity < 1) {
            alert('Invalid quantity');
            return;
          }

          await fetch(`http://localhost:3000/shoppingCart`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ userId, giftId, newQuantity }),
          });

          const updatedSavingCart = savedCartItems.map((item) =>
            item.gift_id === giftId ? { ...item, quantity: newQuantity } : item
          );
          setSavedCartItems(updatedSavingCart);
        } catch (error) {
          console.error('Error saving shopping cart:', error);
        }
      };
      putToDBShoppingCart(giftId, change);
    }
    calculateTotalPrice();
  };


  return (
    <div className="order-management">
      {order.length > 0 && (
        <div className="gift-list">
          <h2>Current Gift List</h2>
          {
            order.map((gift, index) => (
              <div key={index} className="gift-card-cart">
                <input
                  type='checkbox'
                  defaultChecked={gift.isChecked}
                  onChange={() => handleCheckboxChange(gift.gift_id, "current")}
                />
                <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                <h1>{gift.name}</h1>
                <h1>${gift.price}</h1>
                <input
                  type="number"
                  min="1"
                  value={gift.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    const change = newQuantity > gift.quantity ? 1 : -1;
                    handleQuantityChange(gift.gift_id, change, "current");
                  }}
                />
                <div className="tooltip">
                  <button className="btnDelete-cart" onClick={() => handleDeleteGift(gift.gift_id, "current")}>
                    <FaTrashCan />
                  </button>
                  <span className="tooltiptext">Remove item</span>
                </div>
              </div>
            ))
          }
        </div>
      )}
      {!selectedPackage && savedCartItems.length > 0 && (
        <div className="saved-cart">
          <h2>Saved Shopping Cart</h2>
          {
            savedCartItems.map((gift, index) => (
              <div key={index} className="gift-card-cart">
                <input
                  type='checkbox'
                  defaultChecked={gift.isChecked}
                  onChange={() => handleCheckboxChange(gift.gift_id, "saved")}
                />

                <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
                <h1>{gift.name}</h1>
                <h1>${gift.price}</h1>
                <input
                  type="number"
                  min="1"
                  value={gift.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    const change = newQuantity > gift.quantity ? 1 : -1;
                    handleQuantityChange(gift.gift_id, change, "saved");
                  }}
                />
                <div className="tooltip">
                  <button className="btnDelete-cart" onClick={() => handleDeleteGift(gift.gift_id, "saved")}>
                    <FaTrashCan />
                  </button>
                  <span className="tooltiptext">Remove item</span>
                </div>
              </div>
            ))
          }
        </div>
      )}

      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="summary-container">
        {selectedPackage && <button className="btnDelete-cart" onClick={() => handleDeletePackage()}>delete package</button>}
          <p>Total Price: {totalPrice}$</p>
          <button
            className="btn-buy"
            onClick={handlePaymentClick}
            disabled={order.length === 0 && savedCartItems.length === 0}
          >
            Proceed to Payment
          </button>
        </div>
      </div>


      {showLoginPrompt && (
        <div className='modal'>
          <div className="modal-content">
            <h2>Please log in first</h2>
            <button onClick={handleLoginRedirect}>OK</button>
            <button onClick={handleLoginCancel}>Later</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
