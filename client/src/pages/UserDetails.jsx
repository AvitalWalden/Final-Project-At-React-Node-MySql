import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const UserDetails = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [UseDetailsError, setUseDetailsError] = useState('');
    const [userDetails, setUserDetails] = useState({
        name: '',
        username: user.username,
        email: "",
        city: "",
        street: "",
        zipcode: "",
        phone: "",
        role: ""
    });

    const handleChange = (field, value) => {
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                setUser(data);
                localStorage.setItem('currentUser', JSON.stringify(data));
                setUseDetailsError('User created successfully');
                navigate('/gifts');
            })
            .catch(error => {
                setUseDetailsError('Error creating user');
            });
    };

    function ValidateEmail(mailAdress) {
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (mailAdress.match(mailformat)) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div>
            {user != null ?
                <div className='form'>
                    <h2 className="title">User Details</h2><br />
                    <input type="text" className='input' value={user.username} readOnly /><br />
                    <input type="text" className='input' placeholder="name" value={userDetails.name} onChange={(e) => handleChange('name', e.target.value)} /><br />
                    <input type="email" className='input' placeholder="email" value={userDetails.email} onChange={(e) => handleChange('email', e.target.value)} /><br />
                    <input type="text" className='input' placeholder="city" value={userDetails.city} onChange={(e) => handleChange('city', e.target.value)} /><br />
                    <input type="text" className='input' placeholder="street" value={userDetails.street} onChange={(e) => handleChange('street', e.target.value)} /><br />
                    <input type="text" className='input' placeholder="zipcode" value={userDetails.zipcode} onChange={(e) => handleChange('zipcode', e.target.value)} /><br />
                    <input type="tel" className='input' placeholder="phone" value={userDetails.phone} onChange={(e) => handleChange('phone', e.target.value)} /><br />
                    
                    <select className='input' value={userDetails.role} onChange={(e) => handleChange('role', e.target.value)}>
                        <option value="">Select Role</option>
                        {/* <option value="admin">Admin</option> */}
                        <option value="donate">Donate</option>
                        <option value="user">User</option>
                    </select><br />
                    
                    <button className="btnSaveDetails" onClick={handleSubmit}>Save</button><br />
                    {UseDetailsError && <p className='error' style={{ color: UseDetailsError === "The details have been filled in successfully" ? 'green' : 'red' }}>{UseDetailsError}</p>}
                </div>
                : <div></div>
            }
        </div>
    );
}

export default UserDetails;
