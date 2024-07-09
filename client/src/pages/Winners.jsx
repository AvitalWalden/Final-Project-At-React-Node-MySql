import React, { useState, useEffect, useContext } from 'react';
import '../css/Winners.css';
import { UserContext } from './UserContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const { refreshAccessToken } = useContext(UserContext);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const response = await fetch('http://localhost:3000/gifts/winners', {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Refreshing token and retrying...');
          await refreshAccessToken();
          return fetchWinners();
        }

        if (response.status === 403) {
          console.log('invalid token you cannot do it...');
          return;
        }
        throw new Error('Failed to fetch winners');
      }
      const data = await response.json();
      setWinners(data);
    } catch (error) {
       console.log('Error fetching winners:', error);
      setWinners([]);
    }
  };

  return (
    <div className="W-container">
      <h1 className='W-containerH1'>Winners List</h1>
      <div className="winners-container">
        {winners.length > 0 ? (
          winners.map((winner, key) => (
            <div key={key} className="winner-card">
              <img src={`http://localhost:3000/images/${winner.image_url}`} alt={winner.name} />
              <h2>{winner.gift_name}</h2>
              <p>Winner ID: {winner.user_id}</p>
              <p>Winner Name: {winner.name}</p>
            </div>
          ))
        ) : (
          <div>No winners yet</div>
        )}
      </div>
    </div>
  );
};

export default Winners;
