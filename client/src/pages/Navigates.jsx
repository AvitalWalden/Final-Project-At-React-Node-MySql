import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FaGift } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import '../css/Navigates.css'; 
import { LuChevronDown } from "react-icons/lu";
import { LuChevronUp } from "react-icons/lu";
import { FaCartShopping } from "react-icons/fa6";


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
                <Link to="/orderManagement"><FaCartShopping /></Link>
                <Link to="/winners">Winners</Link>
                {user && user.role === 'admin' && <Link to="/Lo">Lottery</Link>}
                {user && user.role === 'admin' && <Link to="/">Edit Gifts</Link>}
                {user && user.role === 'admin' && <Link to="/">Order Management</Link>}
                <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
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
                </div>
            </nav>
        </div>
    );
}

export default Navigates;
