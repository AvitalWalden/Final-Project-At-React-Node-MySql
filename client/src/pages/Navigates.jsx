import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

function Navigates() {
    const { user } = useContext(UserContext);

    return (
        <div>
            <nav>
                {!user && <Link to="/login">LogIn</Link>}
                {user && <Link to="/logout">LogOut</Link>}
                {user && user.role == 'admin' && <Link to="/">order managent</Link>}
            </nav>
        </div>
    );
}

export default Navigates;
