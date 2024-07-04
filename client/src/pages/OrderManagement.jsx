import React, { useContext, useState, useEffect } from 'react';
import { OrderContext } from './OrderContext';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa6";
import '../css/OrderManagement.css';


const OrderManagement = ({ setEnableNav }) => {
  const navigate = useNavigate();
  const { removeFromOrder, setOrder, order, savedCartItems, setSavedCartItems, selectedPackage, setSelectedPackage, totalPrice, setTotalPrice, calculateTotalPrice } = useContext(OrderContext);
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

          if (!response.ok) {
            if (response.status === 402) {
              throw new Error('No Acsses');
            } else {
              throw new Error('Failed to fetch saved cart items');
            }
          }

          const data = await response.json();
          setSavedCartItems(data);
          savedCartItems.forEach((gift) => {
            [{ ...gift, isChecked: false }]
          });
        } catch (error) {
          console.error('Error fetching saved cart items:', error.message);
        }
      }
    };

    fetchSavedCartItems();
  }, [user, order]);



  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [order, savedCartItems, selectedPackage]);

  const handlePaymentClick = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      setEnableNav(false);
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
      const updatedShoppingCart = savedCartItems.map((item) =>
        item.gift_id === giftId ? { ...item, isChecked: !item.isChecked } : item
      );
      setSavedCartItems(updatedShoppingCart);
    }
     calculateTotalPrice();
  };

  const handleDeletePackage = () => {
    setSelectedPackage(null)
    setTotalPrice(calculateTotalPrice());
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
    setTotalPrice(calculateTotalPrice());
  };


  return (
    <div className="order-management">
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            {/* Current Gift List */}
            {order.length > 0 && (
              <div className="ibox">
                <div className="ibox-title">
                  <span className="pull-right">(<strong>{order.length}</strong>) items</span>
                  <h5>Current Gift List</h5>
                </div>
                <div className="ibox-content">
                  <div className="table-responsive">
                    {order.map((gift, index) => (
                      <div key={index} className="shoping-cart-table">
                        <div className="row">
                          <div className="col-md-2">
                            <div className="cart-product-imitation">
                              <input
                                type="checkbox"
                                defaultChecked={gift.isChecked}
                                onChange={() => handleCheckboxChange(gift.gift_id, "current")}
                              />
                            </div>
                            <div className="cart-product-imitation">
                              <img
                                src={`http://localhost:3000/images/${gift.image_url}`}
                                alt={gift.name}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                            </div>
                          </div>
                          <div className="col-md-10">
                            <div className="product-desc">
                              <h3>
                                <a href="#" className="text-navy">
                                  {gift.name}
                                </a>
                              </h3>
                              <div className="row">
                                <div className="col-md-10">
                                  <dl className="small m-b-none">
                                    <dt className="text-right">Price:</dt>
                                    <dd className="text-right">${gift.price}</dd>
                                    <dt className="text-right">Quantity:</dt>
                                    <dd className="text-right">
                                      <input
                                        type="number"
                                        value={gift.quantity}
                                        onChange={(e) => {
                                          const newQuantity = parseInt(e.target.value);
                                          const change = newQuantity > gift.quantity ? 1 : -1;
                                          handleQuantityChange(gift.gift_id, change, "current");
                                        }}
                                        className="form-control text-right custom-width"
                                        min="1"
                                      />
                                    </dd>

                                  </dl>
                                  <div className="m-t-sm">
                                    <a href="#" className="text-muted" onClick={() => handleDeleteGift(gift.gift_id, 'current')}>
                                      <FaTrash /> Remove item
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Saved Shopping Cart */}
            {!selectedPackage && savedCartItems.length > 0 && (
              <div className="ibox">
                <div className="ibox-title">
                  <span className="pull-right">(<strong>{savedCartItems.length}</strong>) items</span>
                  <h5>Saved Shopping Cart</h5>
                </div>
                <div className="ibox-content">
                  <div className="table-responsive">
                    {savedCartItems.map((gift, index) => (
                      <div key={index} className="shoping-cart-table">
                        <div className="row">
                          <div className="col-md-2">
                            <div className="cart-product-imitation">
                              <input
                                type="checkbox"
                                defaultChecked={gift.isChecked}
                                onChange={() => handleCheckboxChange(gift.gift_id, "saved")}
                              />
                            </div>
                            <div className="cart-product-imitation">
                              <img
                                src={`http://localhost:3000/images/${gift.image_url}`}
                                alt={gift.name}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                              />
                            </div>
                          </div>
                          <div className="col-md-10">
                            <div className="product-desc">
                              <h3>
                                <a href="#" className="text-navy">
                                  {gift.name}
                                </a>
                              </h3>
                              <div className="row">
                                <div className="col-md-10">
                                  <dl className="small m-b-none">
                                    <dt className="text-right" >Price:</dt>
                                    <dd className="text-right">${gift.price}</dd>
                                    <dt className="text-right">Quantity:</dt>
                                    <dd className="text-right">
                                      <input
                                        type="number"
                                        value={gift.quantity}
                                        onChange={(e) => {
                                          const newQuantity = parseInt(e.target.value);
                                          const change = newQuantity > gift.quantity ? 1 : -1;
                                          handleQuantityChange(gift.gift_id, change, "saved");
                                        }}
                                        className="form-control text-right custom-width"
                                        min="1"
                                      />
                                    </dd>
                                  </dl>
                                  <div className="m-t-sm">
                                    <a href="#" className="text-muted" onClick={() => handleDeleteGift(gift.gift_id, 'saved')}>
                                      <FaTrash /> Remove item
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-3">
            {/* Selected Package */}
            {selectedPackage && (
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Selected Package</h5>
                </div>
                <div className="ibox-content text-center">
                  <h2 className="no-margins">${selectedPackage.price}</h2>
                  <small style={{ marginRight: `4px` }}>{selectedPackage.name}</small>
                  <button className="btn btn-sm btn-danger m-t-sm" onClick={handleDeletePackage}>
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Total Price */}
            <div className="ibox">
              <div className="ibox-title">
                <h5>Total Price</h5>
              </div>
              <div className="ibox-content text-center">
                <h1 className="no-margins">${totalPrice}</h1>
                <small className="text-muted">Shipping costs and taxes will be calculated at checkout</small>
                <div className="m-t-md">
                  <button className="btn btn-primary btn-sm" onClick={handlePaymentClick}>
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="modal fade show" style={{ display: 'block', zIndex: '1050' }} id="loginPrompt" tabIndex="-1" role="dialog" aria-labelledby="loginPromptTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="loginPromptTitle">Login Required</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleLoginCancel}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>You need to login to proceed to payment.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleLoginRedirect}>Login</button>
                <button type="button" className="btn btn-primary" onClick={handleLoginCancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default OrderManagement;
