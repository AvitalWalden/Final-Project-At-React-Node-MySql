import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

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

    if (password != verifyPassword) {
      setSignUpError('incorect verify password');
      return;
    }
    const url = 'http://localhost:3000/signup';
    const newUser = {
      username: userName,
      password: password,
      role: role
    }
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...newUser })
    };
    fetch(url, requestOptions)
      .then(response => {
        return response.json().then(user => {
          if (response.status == 500) {
            throw user.message;
          }
          setUser(user);
          setverifyPassword("");
          setUserName("");
          setPassword("");
          setRole("");
          navigate("/userDetails");
        })
      })
      .catch(error => {
        setSignUpError(error);
      });
  }

  return (
    <div className='form'>
      <h2 className="title">Create Account</h2><br />
      <input type="text" className='input' value={userName} placeholder="userName" onChange={(e) => setUserName(e.target.value)} /><br />
      <input type="password" className='input' value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} /><br />
      <input type="password" className='input' value={verifyPassword} placeholder="verift-password" onChange={(e) => setverifyPassword(e.target.value)} /><br />
      <select className='input' value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="donate">Donate</option>
        <option value="fundraiser">Fundraiser</option>
        <option value="user">User</option>
      </select><br />
      <button className="btnOkSignUp" onClick={handleRegistration}>Connect</button><br />
      <Link to="/login" className="link">Already have an account? Sign in</Link>
      {signUpError && <p className='error' style={{ color: signUpError == "Registration successful" ? 'green' : "red" }}>{signUpError}</p>}
      <GoogleLogin
        onSuccess={credentialResponse => {
          const credentialResponseDecoded = jwtDecode(credentialResponse.credential)
          console.log(credentialResponseDecoded);
          handleRegistration(credentialResponseDecoded)
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  )
};

export default SignUp;