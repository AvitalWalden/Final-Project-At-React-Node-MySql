import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../pages/UserContext';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
  MDBCheckbox,
  MDBIcon
}
from 'mdb-react-ui-kit';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
// import {handleRegistrationWithGoogle} from "../pages/SignUp"
const logIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { user, setUser } = useContext(UserContext);

  function handleLogin() {
    let foundUser;
    if (!username || !password) {
      setLoginError('Please fill in all fields.');
      return;
    }
    const newUser = {
      username: username,
      password: password
    }

    const url = 'http://localhost:3000/login';
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...newUser })
    };
    fetch(url, requestOptions)
      .then(response => {
        return response.json().then(data => {
          if (response.status == 401) {
            throw data.message;
          }
          foundUser = data;
          setUser({ ...foundUser });
          setUsername('');
          setPassword('');
          setLoginError('Registration successful');
          navigate('/gifts')
        })
      })
      .catch(error => {
        console.log(error);
        setLoginError(error);
      });

  };

  function handleLogInWithGoogle(user) {
    const url = `http://localhost:3000/users/${user.email}`;
    const requestOptions = {
      method: 'GET',
    };
    fetch(url, requestOptions)
      .then(response => {
        return response.json().then(user => {
          if (!response.ok) {
            throw response.error;
          }
          else {
            console.log(user);
            setUser(user);
            navigate("/gifts");

          }
        })
      })
      .catch(error => {
        setLoginError(error);
      });
  }


  function handleRegistrationWithGoogle(user) {
    const url = 'http://localhost:3000/signup';
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...user })
    };
    fetch(url, requestOptions)
      .then(response => {
        return response.json().then(data => {
          if (response.status == 500) {
            if (data.message == 'You need logIn') {
              handleLogInWithGoogle(user);
              navigate("/gifts");
            } else if (data.message == 'email is in use') {
              handleLogInWithGoogle(user);
              navigate("/gifts");
            } else {
              throw data.message;

            }
          }
          else {
            handleLogInWithGoogle(user);
            navigate("/userDetails");

          }
        })
      })
      .catch(error => {
        setLoginError(error);
      });
  }


  return (
    <div className='form'>
      <h2 className="title">Log in</h2><br />
      <input type="userName" className='input' value={username} placeholder="userName" onChange={(e) => setUsername(e.target.value)} /><br />
      <input type="password" className='input' value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} /><br />
      <button className="btnOkLogIn" onClick={handleLogin}>Connect</button><br />
      <Link to="/signup" className="link" >Don't have an account? Create account</Link>
      {loginError && <p className='error' style={{ color: loginError == "Registration successful" ? 'green' : "red" }}>{loginError}</p>}
      <GoogleLogin
        onSuccess={credentialResponse => {
          const credentialResponseDecoded = jwtDecode(credentialResponse.credential)
          console.log(credentialResponseDecoded);
          const user = {
            username: credentialResponseDecoded.name,
            email: credentialResponseDecoded.email,
            role: 'user'
          }
          handleRegistrationWithGoogle(user);

        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
}
export default logIn