import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FaGift, FaUser, FaShoppingCart, FaChartBar } from 'react-icons/fa';
import { TbPackages } from "react-icons/tb";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { GiPodiumWinner ,GiFiles} from "react-icons/gi";
import { LuFerrisWheel } from "react-icons/lu";
import { BiSolidLogOut } from "react-icons/bi";

import '../css/Navigates.css';
import { MDBBadge } from "mdb-react-ui-kit";


const Navigates = ({ enableNav, setEnableNav }) => {
  const { user } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNavPrompt, setShowNavPrompt] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClick = (e) => {
    if (!enableNav) {
      e.preventDefault();
      setShowNavPrompt(true);
    }
  };

  const handleNavRedirect = () => {
    setEnableNav(true);
    setShowNavPrompt(false);
    navigate('/gifts');
  };

  const handleNavCancel = () => {
    setShowNavPrompt(false);
  };

  const linkClassName = enableNav ? 'enabled' : 'disabled';

  return (
    <div>
      <nav>
        {!user ? (
          <Link to="/login" className={linkClassName} onClick={handleClick}>LogIn</Link>
        ) : (
          <Link to="/logout" className={linkClassName} onClick={handleClick}><BiSolidLogOut /> LogOut</Link>
        )}
        <Link to="/gifts" className={linkClassName} onClick={handleClick}> <FaGift /> Gifts</Link>
        <Link to="/packages" className={linkClassName} onClick={handleClick}>  <TbPackages /> Our Packages</Link> 
        {user && <Link to="/giftsChart" className={linkClassName} onClick={handleClick}> <FaChartBar /> GiftsChart</Link>}
        <Link to="/orderManagement" className={linkClassName} onClick={handleClick}>
         <FaShoppingCart /> Order 
        </Link>
        <Link to="/winners" className={linkClassName} onClick={handleClick}><GiPodiumWinner /> Winners</Link>
        {user && user.role === 'admin' && (
          <>
            <Link to="/Lottery" className={linkClassName} onClick={handleClick}><LuFerrisWheel /> Lottery</Link>
            <Link to="/allOrders" className={linkClassName} onClick={handleClick}><GiFiles /> All orders</Link>
          </>
        )}
        <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
          <span className={linkClassName}>
            <FaUser />
            {dropdownOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </span>
          {dropdownOpen && (
            <div className="dropdown-content">
              <Link to="/profile" className={linkClassName} onClick={handleClick}>My Account</Link>
              <Link to="/orders" className={linkClassName} onClick={handleClick}>My Orders</Link>
            </div>
          )}
        </div>
      </nav>
      {showNavPrompt && (
        <div className='alert d-flex align-items-center justify-content-center' style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
          <div className="alert alert-info p-3 text-center" style={{ maxWidth: '400px' }}>
            <h2 className="mb-3">Do you want to cancel order?</h2>
            <div className="d-flex justify-content-center">
              <button className="btn btn-success me-2" onClick={handleNavRedirect}>OK</button>
              <button className="btn btn-danger" onClick={handleNavCancel}>NO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigates;
