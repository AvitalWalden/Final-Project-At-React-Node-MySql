import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const SignUp = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [verifyPassword, setverifyPassword] = useState('');
  const [password, setPassword] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const { setUser } = useContext(UserContext);


  function handleRegistration() {
    if (!userName || !verifyPassword || !password) {
      setSignUpError('Please fill in all fields.');
      return;
    }
    if (!userName || !password) {
      setLoginError('Please fill in all fields.');
      return;
    }
    if (password != verifyPassword) {
      setSignUpError('incorect verify password');
      return;
    }
    const url = 'http://localhost:3000/signup';
    const newUser = {
      username: userName,
      password: password
    }
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
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
      <button className="btnOkSignUp" onClick={handleRegistration}>Connect</button><br />
      <Link to="/login" className="link">Already have an account? Sign in</Link>
      {signUpError && <p className='error' style={{ color: signUpError == "Registration successful" ? 'green' : "red" }}>{signUpError}</p>}
    </div>
  )
};

export default SignUp;