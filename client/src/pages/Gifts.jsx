import React, { useEffect, useState,useContext } from 'react';
import Gift from '../components/Gift';
import '../css/Gift.css';
import { UserContext } from './UserContext';


function Gifts() {
  const [giftes, setGifts] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState('');

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const url = `http://localhost:3000/gifts`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setGifts(data);
      })
  }, []);
  return (
    <>
      <input className='inputItem' type="text" value={searchCriteria} placeholder="Search gift" onChange={(event) => setSearchCriteria(event.target.value)} />
      <div className="gift-container">
        {giftes != null &&
          giftes.map((gift, index) => (
            <Gift key={index} gift={gift} user={user} searchCriteria={searchCriteria} setGifts={setGifts} giftes={giftes}/>
          ))}
      </div>
    </>
  )
}

export default Gifts
