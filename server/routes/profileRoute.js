import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserDetails(user.user_id);
    }
  }, [user]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/profile/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          city: userData.city,
          street: userData.street,
          zipcode: userData.zipcode,
          phone: userData.phone,
          Bonus: userData.Bonus,
          role: userData.role,
        }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        setIsEditing(false);
      } else {
        console.error('Error updating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Profile</h1>
      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={userData.name || ''}
                disabled
              />
            </label>
          </div>
          <div>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={userData.username || ''}
                disabled
              />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={userData.email || ''}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={userData.city || ''}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Street:
              <input
                type="text"
                name="street"
                value={userData.street || ''}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Zipcode:
              <input
                type="text"
                name="zipcode"
                value={userData.zipcode || ''}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={userData.phone || ''}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              Bonus:
              <input
                type="number"
                name="Bonus"
                value={userData.Bonus || ''}
                disabled
              />
            </label>
          </div>
          <div>
            <label>
              Role:
              <input
                type="text"
                name="role"
                value={userData.role || ''}
                disabled
              />
            </label>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>User ID: {userData.user_id}</p>
          <p>Name: {userData.name}</p>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          <p>City: {userData.city}</p>
          <p>Street: {userData.street}</p>
          <p>Zipcode: {userData.zipcode}</p>
          <p>Phone: {userData.phone}</p>
          <p>Bonus: {userData.Bonus}</p>
          <p>Role: {userData.role}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
