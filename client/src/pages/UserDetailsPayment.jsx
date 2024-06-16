import React, { useState } from 'react';

const UserDetailsPayment = ({ user, onNext }) => {
  const [details, setDetails] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/users/${details.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });
      if (!response.ok) {
        throw new Error('Failed to update user details');
      }
      onNext();
    } catch (error) {
      console.error('Error updating user details:', error.message);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Your Details</h2>
      <label>
        Name:
        <input type="text" name="name" value={details.name} onChange={handleChange} />
      </label>
      <label>
        Phone:
        <input type="text" name="phone" value={details.phone} onChange={handleChange} />
      </label>
      <label>
        City:
        <input type="text" name="city" value={details.city} onChange={handleChange} />
      </label>
      <label>
        Street:
        <input type="text" name="street" value={details.street} onChange={handleChange} />
      </label>
      <label>
        Zip Code::
        <input type="text" name="zipcode" value={details.zipcode} onChange={handleChange} />
      </label>
      <button type="submit">Next</button>
    </form>
  );
};

export default UserDetailsPayment;
