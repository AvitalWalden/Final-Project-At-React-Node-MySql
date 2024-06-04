import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Navigates from "./pages/Navigates";
import LogIn from "./pages/LogIn";  // Adjust the import path if necessary
import Gifts from "./pages/Gifts";  // Adjust the import path if necessary
import SignUp from "./pages/SignUp";  // Adjust the import path if necessary
import UserDetails from "./pages/UserDetails";
import LogOut from "./pages/LogOut";
import UserOrders from "./pages/UserOrders";


import { UserProvider } from './pages/UserContext'; // Import UserProvider

function App() {
  return (
    <div>
      <UserProvider> {/* Wrap your app with UserProvider */}
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

            {/* Add more routes as needed */}
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
