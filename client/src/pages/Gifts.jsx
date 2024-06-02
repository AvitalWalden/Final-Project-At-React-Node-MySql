import React, { useEffect, useState } from 'react';
import Gift from '../components/Gift';
import '../css/Gift.css';


function Gifts() {
  const [giftes, setGiftes] = useState();
  const [searchCriteria, setSearchCriteria] = useState('');


  useEffect(() => {
    const url = `http://localhost:3000/gifts`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setGiftes(data);
      })
  }, []);
  return (
    <>
      <input className='inputItem' type="text" value={searchCriteria} placeholder="Search gift" onChange={(event) => setSearchCriteria(event.target.value)} />
      <div className="gift-container">
        {giftes != null &&
          giftes.map((gift, index) => (
            <Gift key={index} gift={gift} searchCriteria={searchCriteria}/>
          ))}
      </div>
    </>
  )
}

export default Gifts
