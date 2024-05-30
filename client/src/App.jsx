import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Navigates from "./pages/Navigates";
import LogIn from "./pages/LogIn";  // Adjust the import path if necessary
import Gifts from "./pages/Gifts";  // Adjust the import path if necessary
import SignUp from "./pages/SignUp";  // Adjust the import path if necessary

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navigates /> 
        <Routes>
          <Route path="/" element={<Navigate to="/gifts" />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
