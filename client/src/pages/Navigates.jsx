import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import LogIn from './LogIn'
import Home from './Home'

function Navigates() {
  return (
    <div>
      <nav>
        <Link to={`logIn`}>LogIn</Link>
        <Link to={`signUp`}>SignUp</Link>
        <Link to={`logout`} >Logout</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="login" element={<LogIn />} />
        <Route path="logout" element={<Home />} />
        <Route path="logout" element={<Home />} />
      </Routes>
    </div>
  )
}

export default Navigates
