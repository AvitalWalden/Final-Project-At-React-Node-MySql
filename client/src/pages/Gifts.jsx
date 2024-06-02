import React, { useEffect, useState,useContext } from 'react';
import Gift from '../components/Gift';
import '../css/Gift.css';
import { UserContext } from './UserContext';


function Gifts() {
  const [giftes, setGiftes] = useState();
  const { user, setUser } = useContext(UserContext);

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

          < Gift key={index} gift={gift} user={user} />

        ))}
    </div>
  )
}

export default Gifts
