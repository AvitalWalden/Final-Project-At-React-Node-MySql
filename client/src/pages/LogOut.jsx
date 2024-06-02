import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const LogOut = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogout = (logout) => {
        if (logout) {
            setUser(null);
            navigate("/gifts");
        }
        else {
            navigate("/gifts");
        }
    };
    return (
        <div className='form'>
            <p>Are you sure you want to logout?</p>
            <button className="logOut" onClick={() => handleLogout(true)}>Yes</button>
            <button className="logOut" onClick={() => handleLogout(false)}>No</button>
        </div>
    );
};

    export default LogOut;