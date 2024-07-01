import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState({
    name: '',
    username: "",
    email: "",
    city: "",
    street: "",
    zipcode: "",
    phone: "",
    role: ""
  });
  const [UseDetailsError, setUseDetailsError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { refreshAccessToken } = useContext(UserContext);


  useEffect(() => {
    if (user) {
      fetchUserDetails(user.user_id);
    }
  }, [user]);

  const fetchUserDetails = async (user_id) => {
    try {
      
      const response = await fetch(`http://localhost:3000/users/${user_id}`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Refreshing token and retrying...');
          await refreshAccessToken();
          return fetchUserDetails(user_id);
        }
        if (response.status === 402) {
          console.log('No Acsses...');
          throw response.error;
        }

        if (response.status === 403) {
          console.log('invalid token you cannot do it...');
          throw response.error;
        }
      }
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails([]);
    }



  };

  const handleChange = (field, value) => {
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [field]: value
    }));
  };

  const handleFormSubmit = async () => {
    if (!userDetails.name || !userDetails.city || !userDetails.street || !userDetails.zipcode || !userDetails.phone) {
      setUseDetailsError('Please fill in all fields.');
      return;
    }
    const url = `http://localhost:3000/users/${user.user_id}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({
        ...userDetails
      })
    };
    try {
      const response = await fetch(url, requestOptions);
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Refreshing token and retrying...');
            await refreshAccessToken();
            return handleFormSubmit();
          }
  
          if (response.status === 403) {
            console.log('invalid token you cannot do it...');
            throw response.error;
          }
        }
        const data = await response.json();
        setUserDetails(data);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating user details:', error);
        setUseDetailsError('Error updating user:', error);
        setUserDetails([]);
      }
  
  
  }

  if (!userDetails) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return (<>
      <p>Please log in to view your profile.</p>
      <br></br>
      <Link to='/login'>Log here</Link>
    </>
    )
  }

  return (
    <div>
      <h1>Your Profile</h1>
      {isEditing ? (
        <div className='form'>
          <input type="text" className='input' value={userDetails.username} readOnly /><br />
          <input type="text" className='input' placeholder="name" value={userDetails.name} onChange={(e) => handleChange('name', e.target.value)} /><br />
          <input type="email" className='input' placeholder="email" value={userDetails.email} onChange={(e) => handleChange('email', e.target.value)} /><br />
          <input type="text" className='input' placeholder="city" value={userDetails.city} onChange={(e) => handleChange('city', e.target.value)} /><br />
          <input type="text" className='input' placeholder="street" value={userDetails.street} onChange={(e) => handleChange('street', e.target.value)} /><br />
          <input type="text" className='input' placeholder="zipcode" value={userDetails.zipcode} onChange={(e) => handleChange('zipcode', e.target.value)} /><br />
          <input type="tel" className='input' placeholder="phone" value={userDetails.phone} onChange={(e) => handleChange('phone', e.target.value)} /><br />
          <input type="text" className='input' placeholder="role" value={userDetails.role} onChange={(e) => handleChange('role', e.target.value)} /><br />
          <button className="btnSaveDetails" onClick={handleFormSubmit}>Save</button><br />

        </div>
      ) : (
        <div className='form'>
          <p className='input'>User ID: {userDetails.user_id}</p>
          <p className='input'>Name: {userDetails.name}</p>
          <p className='input'>Username: {userDetails.username}</p>
          <p className='input'>Email: {userDetails.email}</p>
          <p className='input'>City: {userDetails.city}</p>
          <p className='input'>Street: {userDetails.street}</p>
          <p className='input'>Zipcode: {userDetails.zipcode}</p>
          <p className='input'>Phone: {userDetails.phone}</p>
          <p className='input'>Role: {userDetails.role}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )
      }
    </div >
  );
}

export default Profile;
