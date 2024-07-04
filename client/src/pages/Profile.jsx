import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import { Button, Typography, TextField } from '@mui/material';
import { TbEdit } from "react-icons/tb";
import { TbEditOff } from "react-icons/tb";
import profile from '../images/profile.png';
import '../css/Profile.css'; // Import CSS for styling

const Profile = () => {
  const { user } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState({
    name: '',
    username: '',
    email: '',
    city: '',
    street: '',
    zipcode: '',
    phone: '',
    role: ''
  });
  const [fundraiserDetails, setFundraiserDetails] = useState({
    bonus: '',
    debt: '',
    people_fundraised: ''
  });
  const [useDetailsError, setUseDetailsError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { refreshAccessToken } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchUserDetails(user.user_id);
      if (user.role === 'fundraiser') {
        fetchFundraiserDetails(user.user_id);
      }
    }
  }, [user]);

  const fetchUserDetails = async (user_id) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${user_id}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        handleFetchError(response);
        return;
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails([]);
    }
  };

  const fetchFundraiserDetails = async (user_id) => {
    try {
      const response = await fetch(`http://localhost:3000/fundraisers/${user_id}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        handleFetchError(response);
        return;
      }

      const data = await response.json();
      setFundraiserDetails(data);
    } catch (error) {
      console.error('Error fetching fundraiser details:', error);
      setFundraiserDetails([]);
    }
  };

  const handleFetchError = async (response) => {
    if (response.status === 401) {
      console.log('Refreshing token and retrying...');
      await refreshAccessToken();
      fetchUserDetails(user.user_id);
    } else if (response.status === 403) {
      console.log('Invalid token, you cannot do it...');
      throw response.error;
    } else {
      console.log('No access...');
      throw response.error;
    }
  };

  const handleChange = (field, value) => {
    setUserDetails((prevDetails) => ({
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
      credentials: 'include',
      body: JSON.stringify({
        ...userDetails
      })
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        handleFetchError(response);
        return;
      }

      const data = await response.json();
      setUserDetails(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user details:', error);
      setUseDetailsError('Error updating user:', error);
      setUserDetails([]);
    }
  };

  if (!userDetails || !fundraiserDetails) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <Typography>Please log in to view your profile.</Typography>
        <br />
        <Link to="/login">Log here</Link>
      </>
    );
  }

  return (
    <div className="ProfileContainer gradient-custom">
      <div className="ProfileDetails">
        <Typography variant="h4" className="SectionTitle">Your Profile</Typography>
        {isEditing ? (
          <div className="EditForm">
            <div className="ProfileRow">
              <div className="ProfileText">
                <Typography variant="h6">Name:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter name"
                  value={userDetails.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div className="ProfileText">
                <Typography variant="h6">Email:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter email"
                  value={userDetails.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>
            <hr className="Separator" />
            <div className="ProfileRow">
              <div className="ProfileText">
                <Typography variant="h6">Street:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter street"
                  value={userDetails.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                />
              </div>
              <div className="ProfileText">
                <Typography variant="h6">City:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter city"
                  value={userDetails.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>
              <div className="ProfileText">
                <Typography variant="h6">Zipcode:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter zipcode"
                  value={userDetails.zipcode}
                  onChange={(e) => handleChange('zipcode', e.target.value)}
                />
              </div>
            </div>
            <hr className="Separator" />
            <div className="ProfileRow">
              <div className="ProfileText">
                <Typography variant="h6">Phone:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter phone number"
                  value={userDetails.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
              <div className="ProfileText">
                <Typography variant="h6">Role:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={userDetails.role}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="ProfileView">
            <div className="ProfileRow">
              <div className="ProfileText">
                <Typography variant="h6">Name:</Typography>
                <span>{userDetails.name}</span>
              </div>
              <div className="ProfileText">
                <Typography variant="h6">Email:</Typography>
                <span>{userDetails.email}</span>
              </div>
            </div>
            <hr className="Separator" />
            <div className="ProfileRow">
              <div className="FundraiserText">
                <Typography variant="h6">Street:</Typography>
                <span>{userDetails.street}</span>
              </div>
              <div className="FundraiserText">
                <Typography variant="h6">City:</Typography>
                <span>{userDetails.city}</span>
              </div>
              <div className="FundraiserText">
                <Typography variant="h6">Zipcode:</Typography>
                <span>{userDetails.zipcode}</span>
              </div>
            </div>
            <hr className="Separator" />
            <div className="ProfileRow">
              <div className="ProfileText">
                <Typography variant="h6">Phone:</Typography>
                <span>{userDetails.phone}</span>
              </div>
              <div className="ProfileText">
                <Typography variant="h6">Role:</Typography>
                <span>{userDetails.role}</span>
              </div>
            </div>
            {userDetails.role === 'fundraiser' && (
              <>
                <hr className="Separator" />
                <div className="ProfileRow">
                  <div className="FundraiserText">
                    <Typography variant="h6">People Fundraised:</Typography>
                    <span>{fundraiserDetails.people_fundraised}</span>
                  </div>
                  <div className="FundraiserText">
                    <Typography variant="h6">Bonus:</Typography>
                    <span>{fundraiserDetails.bonus}</span>
                  </div>
                  <div className="FundraiserText">
                    <Typography variant="h6">Debt:</Typography>
                    <span>{fundraiserDetails.debt}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="ProfileSideBar">
        <img className="ProfileImage" src={profile} alt="Profile" />
        <Typography variant="h6" className="Username">{user.username}</Typography>
        <Button
          variant="outlined"
          color="primary"
          className="EditButton"
          startIcon={isEditing ? <TbEditOff /> : <TbEdit />}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Stop Editing' : 'Edit Profile'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
