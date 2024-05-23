import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import Home from "./pages/Home"


function App() {
  return (
    <div>
      {/* <UserContext.Provider> */}
        <BrowserRouter >
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home/*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      {/* </UserContext.Provider> */}
    </div>
  )
}

export default App
