import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { OrderContext } from './OrderContext';
import '../css/Payment.css';

const Payment = () => {
  const { user } = useContext(UserContext);
  const { order,savedCartItems,totalPrice,removeFromSavedShoppingCart,setOrder,setSelectedPackage } = useContext(OrderContext);
  const [newUserDetails, setNewUserDetails] = useState({ name: '', username: '', email: '', city: '', street: '', zipcode: '', phone: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date().toISOString().split('T')[0]; 
      
      if (user.role === 'fundraiser') {
        const newUserResponse = await fetch('http://localhost:3000/users/newUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(newUserDetails),
        });
        if (!newUserResponse.ok) {
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
        const currentFundraiser=await fundraiserGetResponse.json();
        const newDebt = Number(currentFundraiser.debt) + Number(totalPrice);
        const updatedFundraiser = {
          ...currentFundraiser,
          debt: newDebt,
          people_fundraised: currentFundraiser.people_fundraised+1,
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
          body: JSON.stringify({ user_id: newUser.user_id, order_date: formattedDate, order: finalOrder }),
        });
        if (!orderResponse.ok) {
          throw new Error('Failed to create order');
        }
       
      } else {
        const orderResponse = await fetch('http://localhost:3000/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ user_id: user.user_id, order_date: formattedDate, order: finalOrder }),
        });
        if (!orderResponse.ok) {
          throw new Error('Failed to create order');
        }
      }
  
      if (savedCartItems.some(item => item.isChecked)) {
        const checkedItems = savedCartItems.filter(item => item.isChecked);
        const giftIdsToDelete = checkedItems.map(item => item.gift_id); 
        console.log("popp", giftIdsToDelete);
        removeFromSavedShoppingCart(giftIdsToDelete);
      }
      
      
      localStorage.removeItem('selectedPackage');
      localStorage.removeItem('currentOrder');
      setOrder([]);
      alert('Order created successfully!');
      setOrderCreated(true);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  
  if (orderCreated) {
    return <h2 className="success-message">Your order has been placed successfully!</h2>;
  }
      console.log("user",user)

  if (user&&user.role !== 'fundraiser') {
    return (
      <div className="order-button-container">
        <button className="order-button" onClick={handleSubmit}>Place Order</button>
      </div>
    );
  }

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Create New User</h2>
      <label className="form-label">
        Name:
        <input className="form-input" type="text" name="name" value={newUserDetails.name} onChange={handleChange} />
      </label>
      <label className="form-label">
        Username:
        <input className="form-input" type="text" name="username" value={newUserDetails.username} onChange={handleChange} />
      </label>
      <label className="form-label">
        Email:
        <input className="form-input" type="email" name="email" value={newUserDetails.email} onChange={handleChange} />
      </label>
      <label className="form-label">
        Phone:
        <input className="form-input" type="text" name="phone" value={newUserDetails.phone} onChange={handleChange} />
      </label>
      <label className="form-label">
        City:
        <input className="form-input" type="text" name="city" value={newUserDetails.city} onChange={handleChange} />
      </label>
      <label className="form-label">
        Street:
        <input className="form-input" type="text" name="street" value={newUserDetails.street} onChange={handleChange} />
      </label>
      <label className="form-label">
        Zip Code:
        <input className="form-input" type="text" name="zipcode" value={newUserDetails.zipcode} onChange={handleChange} />
      </label>
      <button className="submit-button" type="submit">Create User and Place Order</button>
    </form>
  );
};

export default Payment;
