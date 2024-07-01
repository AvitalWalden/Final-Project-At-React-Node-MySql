import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FaGift } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import '../css/Navigates.css';
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { FaCartShopping } from "react-icons/fa6";
import { TbPackages } from "react-icons/tb";
import { FaRegChartBar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Navigates = ({ enableNav,setEnableNav }) => {
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
                    <Link to="/logout" className={linkClassName} onClick={handleClick}>LogOut</Link>
                )}
                <Link to="/gifts" className={linkClassName} onClick={handleClick}>Gifts <FaGift /></Link>
                <Link to="/packages" className={linkClassName} onClick={handleClick}>Our Packages <TbPackages /></Link>
                {user && <Link to="/giftsChart" className={linkClassName} onClick={handleClick}>GiftsChart <FaRegChartBar /></Link>}
                <Link to="/orderManagement" className={linkClassName} onClick={handleClick}>
                    <FaCartShopping style={{
                        transition: "transform 0.7s, color 0.7s, text-shadow 0.3s, border 0.7s",
                        textShadow: "0 0 10px black, 0 0 20px black, 0 0 30px black, 0 0 40px black, 0 0 50px black, 0 0 60px black, 0 0 70px black",
                    }} />
                </Link>
                <Link to="/winners" className={linkClassName} onClick={handleClick}>Winners</Link>
                {user && user.role === 'admin' && (
                    <Link to="/Lottery" className={linkClassName} onClick={handleClick}>Lottery</Link>
                )}
                {user && user.role === 'admin' && (
                    <Link to="/allOrders" className={linkClassName} onClick={handleClick}>All orders</Link>
                )}
                <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                    <span className={linkClassName}>
                        <FaRegUser />
                        {dropdownOpen ? <LuChevronUp /> : <LuChevronDown />}
                    </span>
                    {dropdownOpen && (
                        <div className="dropdown-content">
                            <Link to="/profile" className={linkClassName} onClick={handleClick}>My Account</Link>
                            <Link to="/orders" className={linkClassName} onClick={handleClick}>Orders</Link>
                        </div>
                    )}
                </div>
            </nav>
            {showNavPrompt && (
                <div className='modal'>
                    <div className="modal-content">
                        <h2>Do you want to cancel order?</h2>
                        <button onClick={handleNavRedirect}>OK</button>
                        <button onClick={handleNavCancel}>NO</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navigates;
