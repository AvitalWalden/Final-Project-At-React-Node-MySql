import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBRadio,
  MDBInput
} from 'mdb-react-ui-kit';
import '../css/SignUp.css';


const SignUp = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [verifyPassword, setverifyPassword] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const { setUser } = useContext(UserContext);

  function handleRegistration() {
    if (!userName || !verifyPassword || !password || !role) {
      setSignUpError('Please fill in all fields.');
      return;
    }

    if (password !== verifyPassword) {
      setSignUpError('Incorrect verify password');
      return;
    }

    const url = 'http://localhost:3000/signup';
    const newUser = {
      username: userName,
      password: password,
      role: role
    };
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newUser)
    };

    fetch(url, requestOptions)
      .then(response => response.json().then(user => {
        if (response.status === 500) {
          throw user.message;
        }
        setUser(user);
        setverifyPassword("");
        setUserName("");
        setPassword("");
        setRole("");
        navigate("/userDetails");
      }))
      .catch(error => {
        setSignUpError(error);
      });
  }

  function handleRegistrationWithGoogle(user) {
    const url = 'http://localhost:3000/signup';
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user)
    };

    fetch(url, requestOptions)
      .then(response => response.json().then(user => {
        if (response.status === 500) {
          if (user.message === 'You need logIn' || user.message === 'email is in use') {
            setSignUpError('You need log in');
          } else {
            throw user.message;
          }
        } else {
          setUser(user);
          navigate("/userDetails");
        }
      }))
      .catch(error => {
        setSignUpError(error);
      });
  }

  return (
    <MDBContainer fluid className='sectionS p-4'>
      <MDBRow>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center textMe'>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3">
          Welcome <br />
            <span className="text-primary">to our platform</span>
          </h1>
          <p className='px-3' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
          The application was developed and designed in order to help and create a better world, a world where others are taken care of. All site donations and all revenues are donated to charity. Thank you for choosing to take part!          </p>
        </MDBCol>

        <MDBCol md='6' >
          <MDBCard className='my-5'>
            <MDBCardBody className='p-5'>
              <MDBRow>
                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' label='Username' id='form1 Username' type='text' value={userName} onChange={(e) => setUserName(e.target.value)} />
                </MDBCol>

                <MDBCol col='6'>
                  <div className='mb-4'>
                    {/* <p className='mb-2'>Role</p> */}
                    <MDBRadio name='roleRadio' id='roleUser' value='user' label='User' onChange={(e) => setRole(e.target.value)} checked={role === 'user'} inline />
                    <MDBRadio name='roleRadio' id='roleFundraiser' value='fundraiser' label='Fundraiser' onChange={(e) => setRole(e.target.value)} checked={role === 'fundraiser'} inline />
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBInput wrapperClass='mb-4' label='Password' id='form1 Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
              <MDBInput wrapperClass='mb-4' label='Verify Password' id='form1 Verify' type='password' value={verifyPassword} onChange={(e) => setverifyPassword(e.target.value)} />
              <MDBBtn className='w-100 mb-4' size='md' onClick={handleRegistration}>Sign Up</MDBBtn>
              <div className="text-center">
                <p>Already have an account? <Link to="/login" className="link">Sign in</Link></p>
                <div className="divider d-flex align-items-center my-4">
                  <p className="text-center fw-bold mx-3 mb-0">Or</p>
                </div>
                <div className='justify-content-center mx-auto' style={{ width: '40%' }}>
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                      const user = {
                        username: credentialResponseDecoded.name,
                        email: credentialResponseDecoded.email,
                        role: 'user'
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
              {signUpError && <p className='error mt-4' style={{ color: signUpError === "Registration successful" ? 'green' : "red" }}>{signUpError}</p>}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default SignUp;
