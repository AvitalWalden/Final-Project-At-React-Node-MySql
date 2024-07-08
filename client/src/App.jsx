import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import React, { useState, useContext, useEffect } from 'react';
import Navigates from "./pages/Navigates";
import LogIn from "./pages/LogIn";
import Gifts from "./pages/Gifts";
import SignUp from "./pages/SignUp";
import UserDetails from "./pages/UserDetails";
import LogOut from "./pages/LogOut";
import UserOrders from "./pages/UserOrders";
import Profile from "./pages/Profile";
import OrderManagement from "./pages/OrderManagement";
import { OrderProvider } from './pages/OrderContext';
import { UserProvider } from './pages/UserContext';
import Winners from "./pages/Winners";
import Lotteries from "./pages/Lotteries";
import AllOrders from "./pages/AllOrders";
import Home from "./pages/Home";
import PackageSelector from "./pages/PackageSelector";
import GiftsChart from "./pages/GiftsChart";
import Payment from "./pages/Payment";
import FundraisersManagement from "./pages/FundraisersManagement";
import 'bootstrap/dist/css/bootstrap.min.css';
import EndOrder from "./pages/EndOrder";
function App() {
  const [enableNav, setEnableNav] = useState(true);
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <OrderProvider>
            <Navigates enableNav={enableNav} setEnableNav={setEnableNav} />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/logout" element={<LogOut />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/userDetails" element={<UserDetails />} />
              <Route path="/orders" element={<UserOrders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orderManagement" element={<OrderManagement setEnableNav={setEnableNav} />} />
              <Route path="/payment" element={<Payment setEnableNav={setEnableNav} />}/>
              <Route path="/winners" element={<Winners />} />
              <Route path="/Lottery" element={<Lotteries />} />
              <Route path="/allOrders" element={<AllOrders />} />
              <Route path="/packages" element={<PackageSelector />} />
              <Route path="/giftsChart" element={<GiftsChart />} />
              <Route path="/fundraisersManagement" element={<FundraisersManagement/>} />
              <Route path="/endOrder" element={<EndOrder/>} />
            </Routes>

          </OrderProvider>
        </UserProvider>
      </BrowserRouter>
      {

      }

    </div>
  );
}

export default App;


