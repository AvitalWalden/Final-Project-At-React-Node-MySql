import React, { useState, useEffect } from 'react';

const Winners = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const url = `http://localhost:3000/gifts/winners`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setWinners(data);
      })
  }, []);

  return (
    <div>
      <h1>Winners List</h1>
      <div className="winners-container">
        {winners.map((winner) => (
          <div key={winner.user_id} className="winner-card">
            <img src={winner.image_url} alt={winner.gift_name} />
            <h2>{winner.gift_name}</h2>
            <p>Winner ID: {winner.user_id}</p>
            <p>Winner name: {winner.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Winners;
