import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBInputGroup, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import '../css/UserDetails.css';


const UserDetails = () => {
    const { refreshAccessToken } = useContext(UserContext);
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [UseDetailsError, setUseDetailsError] = useState('');
    const [saveButton, setSaveButton] = useState(true);

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
        const onlyLetters = /^[a-zA-Z\s]*$/;
        const onlyNumbers = /^[0-9]*$/;

        if (field === 'name' || field === 'username' || field === 'street' || field === 'city') {
            if (!onlyLetters.test(value)) return;
        }

        if (field === 'phone') {
            if (!onlyNumbers.test(value) || value.length > 10) return;
        }
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
            console.log(userDetails)
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                if (response.status === 401) {
                    console.log('Refreshing token and retrying...');
                    await refreshAccessToken();
                    return handleSubmit();
                } else if (response.status === 403) {
                    console.log('Invalid token, you cannot do it...');
                    return;
                } else if (response.status === 400) {
                    console.log("Fill in the data")
                    return;
                }
                else {
                    const responseData = await response.json();
                    setUseDetailsError(responseData.message);
                }
            }
            else {
                if (user.role === "fundraiser") {
                    setUseDetailsError('Your detailes have been saved successfully! Waiting to admin approval...')
                    setSaveButton(false)
                    setTimeout(() => {
                        setUser(null);
                        navigate('/login')
                    }, 3000);
                    return;
                }
                const responseData = await response.json();
                setUser(responseData);
                localStorage.setItem('currentUser', JSON.stringify(responseData));
                setUseDetailsError('User updated successfully');
                navigate('/gifts');
            }

        } catch (error) {
            console.log('Error saving user details:', error);
            setUseDetailsError('Error updating user');
        }
    };

    function ValidateEmail(mailAdress) {
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return mailAdress.match(mailformat);
    }

    return (

        <div className="user-details-container">
            {user ? (
                <div className="custom-shape">
                    <MDBContainer fluid>
                        <MDBCard className="card-custom h-100">
                            <MDBCardBody>
                                <div className="text-center mb-4">
                                    <MDBTypography tag="h4" style={{ color: '#495057' }}>User Details</MDBTypography>
                                </div>
                                <MDBContainer fluid className='sectionS p-4'>
                                    {UseDetailsError && <MDBInputGroup className='error' style={{ color: UseDetailsError === "User updated successfully" ? 'green' : 'red' }}>{UseDetailsError}</MDBInputGroup>}
                                    <MDBRow className="mb-4">
                                        <MDBCol>
                                            <MDBInput label='Name' type='text' value={userDetails.name} onChange={(e) => handleChange('name', e.target.value)} />
                                        </MDBCol>
                                        <MDBCol>
                                            <MDBInput label='Username' type='text' value={userDetails.username} onChange={(e) => handleChange('username', e.target.value)} />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className="mb-4">
                                        <MDBCol>
                                            <MDBInput label='City' type='text' value={userDetails.city} onChange={(e) => handleChange('city', e.target.value)} />
                                        </MDBCol>
                                        <MDBCol>
                                            <MDBInput label='ZipCode' type='number' value={userDetails.zipcode} onChange={(e) => handleChange('zipcode', e.target.value)} />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className="mb-4">
                                        <MDBCol>
                                            <MDBInput label='Street' type='text' value={userDetails.street} onChange={(e) => handleChange('street', e.target.value)} />
                                        </MDBCol>
                                        <MDBCol>
                                            <MDBInput label='Email' type='email' value={userDetails.email} onChange={(e) => handleChange('email', e.target.value)} />
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBRow className="mb-4">
                                        <MDBCol>
                                            <MDBInput label='Phone' type='tel' value={userDetails.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                                        </MDBCol>
                                    </MDBRow>
                                    <div className="text-end">
                                        <MDBBtn className='w-100 mb-4' size='md' onClick={handleSubmit} disabled={!saveButton}>Save Details</MDBBtn>
                                    </div>
                                </MDBContainer>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBContainer>

                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
export default UserDetails;
