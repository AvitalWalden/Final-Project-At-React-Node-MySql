import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FaGift } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import '../css/Navigates.css'; // Import the CSS file for styling
import { LuChevronDown } from "react-icons/lu";
import { LuChevronUp } from "react-icons/lu";

function Navigates() {
    const { user } = useContext(UserContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div>
            <nav>
                {!user && <Link to="/login">LogIn</Link>}
                {user && <Link to="/logout">LogOut</Link>}
                <Link to="/gifts">Gifts <FaGift /></Link>
                
                <Link className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                    <span>
                        <FaRegUser />
                        {dropdownOpen ? <LuChevronUp /> : <LuChevronDown />}
                    </span>
                    {dropdownOpen && (
                        <div className="dropdown-content">
                            <Link to="/profile">My Account</Link>
                            <Link to="/orders">Orders</Link>
                        </div>
                    )}
                </Link>
                
                {user && user.role === 'admin' && <Link to="/">Order Management</Link>}
            </nav>
        </div>
    );
}

export default Navigates;
