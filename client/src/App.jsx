import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import React, { useState, useContext, useEffect } from 'react';
import Navigates from "./pages/Navigates";
import LogIn from "./pages/LogIn";  // Adjust the import path if necessary
import Gifts from "./pages/Gifts";  // Adjust the import path if necessary
import SignUp from "./pages/SignUp";  // Adjust the import path if necessary
import UserDetails from "./pages/UserDetails";
import LogOut from "./pages/LogOut";
import UserOrders from "./pages/UserOrders";
import Profile from "./pages/Profile";
// import Payment from "./pages/Payment";
import OrderManagement from "./pages/OrderManagement";
import { OrderProvider } from './pages/OrderContext';
import { UserProvider } from './pages/UserContext';
import Winners from "./pages/Winners";
import Lotteries from "./pages/Lotteries";
import AllOrders from "./pages/AllOrders";
import Home from "./pages/Home";
import { UserContext } from './pages/UserContext';
import { GoogleLogin } from '@react-oauth/google';
// import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


function App() {
  // const { setUser } = useContext(UserContext);
  // const navigate = useNavigate();

  function handleRegistration(credentialResponseDecoded) {
    const url = 'http://localhost:3000/signup';
    const newUser = {
      username: "חליחלחי",
      password: credentialResponseDecoded,
      role: "user"
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
          // setUser(user);
        })
      })
      .catch(error => {
      });
  }
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <OrderProvider>
            <Navigates />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/logout" element={<LogOut />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/userDetails" element={<UserDetails />} />
              <Route path="/orders" element={<UserOrders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orderManagement" element={<OrderManagement />} />
              {/* <Route path="/payment" element={<Payment />} /> */}
              <Route path="/winners" element={<Winners />} />
              <Route path="/Lottery" element={<Lotteries />} />
              <Route path="/allOrders" element={<AllOrders />} />


            </Routes>
          </OrderProvider>
        </UserProvider>
      </BrowserRouter>
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
  );
}

export default App;


