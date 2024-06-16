import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Navigates from "./pages/Navigates";
import LogIn from "./pages/LogIn";  // Adjust the import path if necessary
import Gifts from "./pages/Gifts";  // Adjust the import path if necessary
import SignUp from "./pages/SignUp";  // Adjust the import path if necessary
import UserDetails from "./pages/UserDetails";
import LogOut from "./pages/LogOut";
import UserOrders from "./pages/UserOrders";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import OrderManagement from "./pages/OrderManagement";
import { OrderProvider } from './pages/OrderContext';
import { UserProvider } from './pages/UserContext';
import Winners from "./pages/Winners";
import Lotteries from "./pages/Lotteries";
import AllOrders from "./pages/AllOrders";
// import { createContext, useState } from 'react';

function App() {
  // const [user, setUser] = useState();
  return (
    <div>
      {/* <UserContext.Provider value={{ user, setUser }}> */}
        <UserProvider>
          <OrderProvider>
            <BrowserRouter>
              <Navigates />
              <Routes>
                <Route path="/" element={<Navigate to="/gifts" />} />
                <Route path="/gifts" element={<Gifts />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/logout" element={<LogOut />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/userDetails" element={<UserDetails />} />
                <Route path="/orders" element={<UserOrders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orderManagement" element={<OrderManagement />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/winners" element={<Winners />} />
                <Route path="/Lottery" element={<Lotteries />} />
                <Route path="/allOrders" element={<AllOrders />} />

              </Routes>
            </BrowserRouter>
          </OrderProvider>
        </UserProvider>
      {/* </UserContext.Provider> */}
    </div>
  );
}

export default App;
