import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FaGift } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import '../css/Navigates.css';
import { LuChevronDown } from "react-icons/lu";
import { LuChevronUp } from "react-icons/lu";
import { FaCartShopping } from "react-icons/fa6";
import { TbPackages } from "react-icons/tb";
import { FaRegChartBar } from "react-icons/fa";



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
                <Link to="/packages">Our Packages <TbPackages /></Link>
                {user && <Link to="/giftsChart"> GiftsChart <FaRegChartBar /></Link>}

                <Link to="/orderManagement"><FaCartShopping style={{
                    transition: "transform 0.7s, color 0.7s, text-shadow 0.3s, border 0.7s",
                    textShadow: "0 0 10px black, 0 0 20px black, 0 0 30px black, 0 0 40px black, 0 0 50px black, 0 0 60px black, 0 0 70px black",
                }} /></Link>
                <Link to="/winners">Winners</Link>
                {user && user.role === 'admin' && <Link to="/Lottery">Lottery</Link>}
                {user && user.role === 'admin' && <Link to="/allOrders">All orders</Link>}
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
