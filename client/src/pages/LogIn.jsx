import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../pages/UserContext';
import { MDBContainer, MDBInput, MDBBtn, MDBCol, MDBRow, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { GoogleLogin } from '@react-oauth/google';
import '../css/SignUp.css';
import '../App.css';
import { jwtDecode } from "jwt-decode";

const LogIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { setUser } = useContext(UserContext);

  const fetchFundraiser = async (data) => {
    try {
      const fundraiserUrl = `http://localhost:3000/fundraisers/${data.user_id}`;
      const fundraiserRequestOptions = {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      };

      const fundraiserResponse = await fetch(fundraiserUrl, fundraiserRequestOptions);
      const fundraiserData = await fundraiserResponse.json();

      if (!fundraiserResponse.ok) {
        if (fundraiserResponse.status === 500) {
          throw fundraiserResponse.error;
        }
        throw data.message;
      } else {
        if (fundraiserData.status === 'pending') {
          setLoginError('Waiting for admin approval');
          return;
        } else if (fundraiserData.status === 'blocked') {
          setLoginError('You have been blocked by the admin!');
          return;
        }
      }
    } catch {
      setLoginError('Failed to fetch fundraiser data');
    }
  }

  const handleLogin = async () => {
    if (!username || !password) {
      setLoginError('Please fill in all fields.');
      return;
    }

    const url = 'http://localhost:3000/login';
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 500) {
          throw data.message;
        }
        else if (response.status === 400) {
          console.log("Fill in the data")
          throw data.message;
        } else {
          throw data.message;
        }
      }
      else {
        if (data.role === 'fundraiser') {
          fetchFundraiser(data);
        }
        setUser(data);
        setUsername('');
        setPassword('');
        setLoginError('Login successful');
        navigate('/gifts');
      }
    } catch (error) {
      setLoginError(error);
    }
  };

  function handleRegistrationWithGoogle(user) {
    const url = 'http://localhost:3000/login';
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user)
    };

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          throw data.message;
        }
        setUser(data);
        navigate('/gifts');
      })
      .catch(error => {
        setLoginError(error);
      });
  }

  return (
    <div className='bigDiv'>
      <MDBContainer fluid className='sectionS p-4'>
        <MDBRow>
          <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center textMe'>
            <h1 className="my-5 display-3 fw-bold ls-tight px-3">
              Welcome back <br />
              <span className="text-primary">to our platform</span>
            </h1>
            <p className='px-3' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
              The application was developed and designed in order to help and create a better world, a world where others are taken care of. All site donations and all revenues are donated to charity. Thank you for choosing to take part!            </p>
          </MDBCol>

          <MDBCol md='6' >
            <MDBCard className='my-5'>
              <MDBCardBody className='p-5'>
                {loginError && <p className='error mt-4' style={{ color: loginError === "Registration successful" ? 'green' : "red" }}>{loginError}</p>}
                <MDBRow>
                  <MDBCol col='12'>
                    <MDBInput wrapperClass='mb-4' label='Username' id='form1 Username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                  </MDBCol>
                </MDBRow>
                <MDBInput wrapperClass='mb-4' label='Password' id='form1 Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <MDBBtn className='w-100 mb-4' size='md' onClick={handleLogin}>Log In</MDBBtn>
                <div className="text-center">
                  <p>Not a member? <Link to="/signup" className="link">Sign Up</Link></p>
                  <div className="divider d-flex align-items-center my-4">
                    <p className="text-center fw-bold mx-3 mb-0">Or</p>
                  </div>
                  <div className='justify-content-center mx-auto' style={{ width: '40%' }}>
                    <GoogleLogin
                      onSuccess={credentialResponse => {
                        const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                        const user = {
                          username: credentialResponseDecoded.name,
                          email: credentialResponseDecoded.email
                        };
                        handleRegistrationWithGoogle(user);
                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                      render={renderProps => (
                        <button
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                          className="google-icon-button"
                        >
                          <i className="fab fa-google"></i>
                        </button>
                      )}
                    />
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default LogIn;
