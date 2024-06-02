import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FaGift } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";


function Navigates() {
    const { user } = useContext(UserContext);

    return (
        <div>
            <nav>
                {!user && <Link to="/login">LogIn</Link>}
                {user && <Link to="/logout">LogOut</Link>}
                {<Link to="/gifts">Gifts <FaGift /></Link>}
                {<Link to="/gifts"><FaRegUser /></Link>}


                {user && user.role == 'admin' && <Link to="/">order managent</Link>}
            </nav>
        </div>
    );
}

export default Navigates;
