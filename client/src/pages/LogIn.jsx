import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../pages/UserContext';

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
      // credentials: "include",
      body: JSON.stringify({ ...newUser })
    };
    fetch(url, requestOptions)
      .then(response => {
        return response.json().then(data => {
          if (response.status == 401) {
            throw data.message;
          }
          foundUser = data.user;
          const userToLS = { ...foundUser };
          delete userToLS.password;
          localStorage.setItem('currentUser', JSON.stringify(userToLS));
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
  return (
    <div className='form'>
      <h2 className="title">Log in</h2><br />
      <input type="userName" className='input' value={username} placeholder="userName" onChange={(e) => setUsername(e.target.value)} /><br />
      <input type="password" className='input' value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} /><br />
      <button className="btnOkLogIn" onClick={handleLogin}>Connect</button><br />
      <Link to="/signup" className="link" >Don't have an account? Create account</Link>
      {loginError && <p className='error' style={{ color: loginError == "Registration successful" ? 'green' : "red" }}>{loginError}</p>}
    </div>
  );
}
export default logIn