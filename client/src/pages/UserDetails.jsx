import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const UserDetails = () => {
    const { refreshAccessToken } = useContext(UserContext);
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [UseDetailsError, setUseDetailsError] = useState('');
    const [userDetails, setUserDetails] = useState({
        name: '',
        username: user?.username || '',
        email: user?.email || '',
        city: '',
        street: '',
        zipcode: '',
        phone: '',
    });

    const handleChange = (field, value) => {
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!userDetails.name || !userDetails.city || !userDetails.street || !userDetails.zipcode || !userDetails.phone) {
            setUseDetailsError('Please fill in all fields.');
            return;
        }
        if (!ValidateEmail(userDetails.email)) {
            setUseDetailsError("You have entered an invalid email address!");
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
                    return handleSubmit();
                } else if (response.status === 403) {
                    console.log('Invalid token, you cannot do it...');
                    throw new Error('Invalid token');
                } else {
                    setUseDetailsError('email is in use');
                }
            }
            else {
                const responseData = await response.json();
                setUser(responseData);
                localStorage.setItem('currentUser', JSON.stringify(responseData));
                setUseDetailsError('User updated successfully');
                navigate('/gifts');
            }

        } catch (error) {
            console.error('Error saving user details:', error);
            setUseDetailsError('Error updating user');
        }
    };

    function ValidateEmail(mailAdress) {
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return mailAdress.match(mailformat);
    }

    return (
        <div>
            {user ?
                <div className='form'>
                    <h2 className="title">User Details</h2><br />
                    <input type="text" className='input' value={user.username} readOnly /><br />
                    <input type="text" className='input' placeholder="name" value={userDetails.name} onChange={(e) => handleChange('name', e.target.value)} /><br />
                    <input type="email" className='input' placeholder="email" value={userDetails.email} onChange={(e) => handleChange('email', e.target.value)} /><br />
                    <input type="text" className='input' placeholder="city" value={userDetails.city} onChange={(e) => handleChange('city', e.target.value)} /><br />
                    <input type="text" className='input' placeholder="street" value={userDetails.street} onChange={(e) => handleChange('street', e.target.value)} /><br />
                    <input type="text" className='input' placeholder="zipcode" value={userDetails.zipcode} onChange={(e) => handleChange('zipcode', e.target.value)} /><br />
                    <input type="tel" className='input' placeholder="phone" value={userDetails.phone} onChange={(e) => handleChange('phone', e.target.value)} /><br />
                    <button className="btnSaveDetails" onClick={handleSubmit}>Save</button><br />
                    {UseDetailsError && <p className='error' style={{ color: UseDetailsError === "User updated successfully" ? 'green' : 'red' }}>{UseDetailsError}</p>}
                </div>
                : <div></div>
            }
        </div>
    );
}

export default UserDetails;
