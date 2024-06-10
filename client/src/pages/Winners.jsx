import React, { useState, useEffect } from 'react';

const Winners = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const url = 'http://localhost:3000/gifts/winners';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWinners(data);
      } catch (error) {
        console.error('Error fetching winners:', error);
        setWinners([]);
      }
    };

    fetchWinners();
  }, []);

  return (
    <div>
      <h1>Winners List</h1>
      <div className="winners-container">
        {winners.length>0 ? (
          winners.map((winner,key) => (
            <div key={key} className="winner-card">
              <img src={winner.image_url} alt={winner.gift_name} />
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
