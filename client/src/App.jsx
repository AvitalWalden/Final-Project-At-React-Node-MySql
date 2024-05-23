import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import Home from "./pages/Home"
import Navigates from "./pages/Navigates"


function App() {
  return (
    <div>
      {/* <UserContext.Provider> */}
        <BrowserRouter >
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home/*" element={<Navigates />} />
          </Routes>
        </BrowserRouter>
      {/* </UserContext.Provider> */}
    </div>
  )
}

export default App
