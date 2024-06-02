import React from 'react';
import { Link } from 'react-router-dom';

function Navigates() {
  return (
    <div>
      <nav>
        <Link to="/login">LogIn</Link>
        {/* <Link to="/signup">SignUp</Link> */}
        <Link to="/logout">Logout</Link>
      </nav>
    </div>
  );
}

export default Navigates;
