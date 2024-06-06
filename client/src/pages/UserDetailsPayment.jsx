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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save details logic here
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Your Details</h2>
      <label>
        Name:
        <input type="text" name="name" value={details.name} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={details.email} onChange={handleChange} />
      </label>
      {/* Add more fields as necessary */}
      <button type="submit">Next</button>
    </form>
  );
};

export default UserDetailsPayment;
