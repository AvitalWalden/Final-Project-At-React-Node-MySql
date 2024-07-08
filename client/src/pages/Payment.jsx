import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { OrderContext } from './OrderContext';
import OrderSummary from '../components/OrderSummary';
import '../css/Payment.css'; // Import your CSS for Payment component if needed
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap'; // Import Bootstrap components
import { MDBBtn, MDBCheckbox } from "mdb-react-ui-kit";

const Payment = ({ setEnableNav }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { order, savedCartItems, totalPrice, removeFromSavedShoppingCart, setOrder, setSelectedPackage, setTotalPrice } = useContext(OrderContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [bonusChecked, setBonusChecked] = useState(false);

  const [newUserDetails, setNewUserDetails] = useState({
    name: '',
    username: '',
    email: '',
    city: '',
    street: '',
    zipcode: '',
    phone: ''
  });
  useEffect(() => {
    setEnableNav(false)
  }, [0]);
  useEffect(() => {
    if (checkboxChecked && user) {
      setNewUserDetails({
        name: user.name,
        username: user.username,
        email: user.email,
        city: user.city,
        street: user.street,
        zipcode: user.zipcode,
        phone: user.phone
      });
    } else {
      setNewUserDetails({
        name: '',
        username: '',
        email: '',
        city: '',
        street: '',
        zipcode: '',
        phone: ''
      });
    }
  }, [checkboxChecked, user]);

  const [orderCreated, setOrderCreated] = useState(false);

  const finalOrder = [
    ...order.filter(item => item.isChecked),
    ...savedCartItems.filter(item => item.isChecked)
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserDetails({
      ...newUserDetails,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Check if all fields are filled
    if (validateForm()) {
      setCurrentStep(2);
    } else {
      alert('Please fill in all fields.');
    }
  };
  const handleCheckboxChange = (e) => {
    setCheckboxChecked(e.target.checked);
  };

  const validateForm = () => {
    return (
      newUserDetails.name !== '' &&
      newUserDetails.username !== '' &&
      newUserDetails.email !== '' &&
      newUserDetails.phone !== '' &&
      newUserDetails.city !== '' &&
      newUserDetails.street !== '' &&
      newUserDetails.zipcode !== ''
    );
  };

  const handlePrevSubmit = async (e) => {
    e.preventDefault();
    setCurrentStep(1);
    setBonusChecked(false);

  };
  const handleUserOrder = async () => {
    const formattedDate = new Date().toISOString().split('T')[0];
    try {
      const orderResponse = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user_id: user.user_id, order_date: formattedDate, order: finalOrder, totalPrice: totalPrice, email: user.email }),
      });
      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
      if (savedCartItems.some(item => item.isChecked)) {
        const checkedItems = savedCartItems.filter(item => item.isChecked);
        const giftIdsToDelete = checkedItems.map(item => item.gift_id);
        removeFromSavedShoppingCart(giftIdsToDelete);
      }
      
      setOrderCreated(true);

    } catch (error) {
      console.error('Error:', error.message);

    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date().toISOString().split('T')[0];

      if (user && user.role === 'fundraiser' && !checkboxChecked) {
        const newUserResponse = await fetch('http://localhost:3000/users/newUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(newUserDetails),
        });
        if (!newUserResponse.ok) {
          if (newUserResponse.status === 400) {
            console.log("Fill in the data")
            return;
          }
          throw new Error('Failed to create new user');
        }
        const newUser = await newUserResponse.json();
        const fundraiserGetResponse = await fetch(`http://localhost:3000/fundraisers/${user.user_id}`, {
          method: "GET",
          credentials: "include"
        });
        if (!fundraiserGetResponse.ok) {
          throw new Error('Failed to get fundraiser');
        }
        const currentFundraiser = await fundraiserGetResponse.json();
        const newDebt = Number(currentFundraiser.debt) + Number(totalPrice);
        const updatedFundraiser = {
          ...currentFundraiser,
          debt: newDebt,
          people_fundraised: currentFundraiser.people_fundraised + 1,
          bonus: currentFundraiser.bonus + totalPrice * 0.05,
        };
        const fundraiserResponse = await fetch(`http://localhost:3000/fundraisers/${user.user_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedFundraiser),
        });
        if (!fundraiserResponse.ok) {
          throw new Error('Failed to update fundraiser');
        }

        const orderResponse = await fetch('http://localhost:3000/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ user_id: newUser.user_id, order_date: formattedDate, order: finalOrder, totalPrice: totalPrice, email: user.email }),
        });
        if (!orderResponse.ok) {
          throw new Error('Failed to create order');
        }

      } if (user && user.role === 'fundraiser' && checkboxChecked && bonusChecked) {
        try {
          const updatedFundraiser = {
            user_id: user.user_id,
            debt: user.debt,
            people_fundraised: user.people_fundraised,
            bonus: 0
          }
          const fundraiserResponse = await fetch(`http://localhost:3000/fundraisers/${user.user_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(updatedFundraiser),
          });
          if (!fundraiserResponse.ok) {
            if (!response.ok) {
              if (response.status === 401) {
                console.log('Refreshing token and retrying...');
                await refreshAccessToken();
                return handleBonusClick();
              }
              throw new Error('Failed to update fundraiser.');
            }
          }

        } catch (error) {
          console.error('Error during updating fundraiser:', error);

        };
        handleUserOrder();
      }
      else {
        handleUserOrder();
      }
    }
    catch {
      console.error('Error:', error.message);
    }
  }
  useEffect(() => {
    if (user && orderCreated) {
      localStorage.removeItem('selectedPackage');
      localStorage.removeItem('currentOrder');
      setOrder([]);
      setEnableNav(true);
      setSelectedPackage(false);
      navigate('/endOrder');
    }
  }, [orderCreated, setOrder, setEnableNav, setSelectedPackage, navigate, user]);


  return (
    <div className="payment-container d-flex flex-column align-items-center justify-content-center">
      {user && user.role === "fundraiser" && (
        <>
          <div className="steps-container mb-3">
            <div className={`step-indicator ${currentStep === 1 ? 'active' : ''}`}>
              <span>1</span>
            </div>
            <div className={`step-indicator ${currentStep === 2 ? 'active' : ''}`}>
              <span>2</span>
            </div>
          </div>
          {currentStep === 1 && (
            <div className="user-form-container">
              <h2>Add Donor</h2>
              <MDBCheckbox label="My order" v-model="checkbox1" checked={checkboxChecked} onChange={handleCheckboxChange} />
              <Form onSubmit={handleFormSubmit} className="user-form">
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={newUserDetails.name}
                      onChange={handleChange}
                      className="field1"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={newUserDetails.username}
                      onChange={handleChange}
                      className="field1"
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={newUserDetails.email}
                      onChange={handleChange}
                      className="field1"
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={newUserDetails.phone}
                      onChange={handleChange}
                      className="field1"
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={newUserDetails.city}
                      onChange={handleChange}
                      className="field2"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridStreet">
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      type="text"
                      name="street"
                      value={newUserDetails.street}
                      onChange={handleChange}
                      className="field2"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      type="text"
                      name="zipcode"
                      value={newUserDetails.zipcode}
                      onChange={handleChange}
                      className="field2"
                    />
                  </Form.Group>
                </Row>
                <Button variant="primary" type="submit" className="form-button" style={{ backgroundColor: "#60bdf3" }} >
                  Next
                </Button>
              </Form>
            </div>
          )}
          {currentStep === 2 && (
            <div className="order-summary-container">
              {user && <OrderSummary
                finalOrder={finalOrder}
                totalPrice={totalPrice}
                setTotalPrice={setTotalPrice}
                checkboxChecked={checkboxChecked}
                handleSubmit={handleSubmit}
                handlePrevSubmit={handlePrevSubmit}
                setBonusChecked={setBonusChecked}
                bonusChecked={bonusChecked}
              />}
            </div>
          )}
        </>
      )}
      {user && user.role !== "fundraiser" && (
        <div className="order-summary-container">
          {user && <OrderSummary
            finalOrder={finalOrder}
            totalPrice={totalPrice}
            setTotalPrice={setTotalPrice}
            handleSubmit={handleSubmit}
            handlePrevSubmit={false}
          />}
        </div>
      )}
    </div>
  );
};

export default Payment;
