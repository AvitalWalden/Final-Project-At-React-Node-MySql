import React, { useEffect, useState } from 'react';
import Gift from '../components/Gift';
import '../css/Gift.css';


function Gifts() {
  const [giftes, setGiftes] = useState();

  useEffect(() => {
    const url = `http://localhost:3000/gifts`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setGiftes(data);
      })
  }, []);
  return (
    <div className="gift-container">
      {giftes != null &&
        giftes.map((gift, index) => (

          < Gift key={index} gift={gift} />

        ))}
    </div>
  )
}

export default Gifts
