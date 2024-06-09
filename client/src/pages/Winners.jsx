import React, { useState, useEffect } from 'react';

const Winners = () => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const url = `http://localhost:3000/winners`;
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
          <div key={winner.ticket_id} className="winner-card">
            <img src={winner.image_url} alt={winner.name} />
            <div>
              <h2>{winner.name}</h2>
              <p>Winner: {winner.winner_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Winners;
