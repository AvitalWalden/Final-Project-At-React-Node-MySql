import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import LogIn from './LogIn'
import Gifts from './Gifts'

function Navigates() {
  return (
    <div>
      <nav>
        <Link to={`logIn`}>LogIn</Link>
        <Link to={`signUp`}>SignUp</Link>
        <Link to={`logout`} >Logout</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Gifts />} />
        
        <Route path="login" element={<LogIn />} />
        <Route path="signUp" element={<signUp />} />
        {/* <Route path="logout" element={} /> */}
      </Routes>
    </div>
  )
}

export default Navigates
