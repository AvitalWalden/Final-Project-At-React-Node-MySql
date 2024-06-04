import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';




const Profile = () => {
  const { user } = useContext(UserContext);

  // ... (rest of the Profile component logic)

  return (
    <div>
      <h1>Your Profile</h1>
      <div>
        <p>User ID: {user?.user_id}</p>
        <p>Name: {user?.name}</p>
        <p>Username: {user?.username}</p>
        {user?.email && <p>Email: {user?.email}</p>}  {/* Display email if available */}
        {user?.address_id && <p>Address ID: {user?.address_id}</p>}  {/* Display address ID if available */}
        {user?.phone && <p>Phone: {user?.phone}</p>}  {/* Display phone if available */}
        <p>Bonus: {user?.Bonus}</p>
        <p>Role: {user?.role}</p>
      </div>
      {/* ... (edit form logic, if applicable) */}
    </div>
  );
};
export default Profile;