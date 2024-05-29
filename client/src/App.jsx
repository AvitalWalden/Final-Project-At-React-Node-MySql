import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import Navigates from "./pages/Navigates"


function App() {
  return (
    <div>
      {/* <UserContext.Provider> */}
        <BrowserRouter >
          <Routes>
            <Route path="/" element={<Navigate to="/Gifts" />} />
            <Route path="/Gifts/*" element={<Navigates />} />
          </Routes>
        </BrowserRouter>
      {/* </UserContext.Provider> */}
    </div>
  )
}

export default App
