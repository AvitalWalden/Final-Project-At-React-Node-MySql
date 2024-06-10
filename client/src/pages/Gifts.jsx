import React, { useEffect, useState, useContext } from 'react';
import Gift from '../components/Gift';
import '../css/Gift.css';
import { UserContext } from './UserContext';

function Gifts() {
  const [giftes, setGifts] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [isAddGiftModalOpen, setIsAddGiftModalOpen] = useState(false);
  const [newGift, setNewGift] = useState({ name: '', price: '', image_url: '' });

  const { user } = useContext(UserContext);

  useEffect(() => {
    const url = `http://localhost:3000/gifts`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const filteredGifts = data.filter(gift => !gift.winner_id);
        setGifts(filteredGifts);
      })
  }, []);

  const handleAddGift = () => {
    setIsAddGiftModalOpen(true);
  };

  const saveGift = () => {
    const url = 'http://localhost:3000/gifts';
    const method = 'POST';
    const giftData = newGift;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(giftData)
    })
      .then(res => res.json())
      .then(data => {
        setGifts([...giftes, data]);
        setIsAddGiftModalOpen(false);
        setNewGift({ name: '', price: '', image_url: '' });
      });
  };

  return (
    <>
      <input className='inputItem' type="text" value={searchCriteria} placeholder="Search gift" onChange={(event) => setSearchCriteria(event.target.value)} />
      <div className="gift-container">
        {giftes != null &&
          giftes.map((gift, index) => (
            <Gift key={index} gift={gift} user={user} searchCriteria={searchCriteria} setGifts={setGifts} giftes={giftes} />
          ))}
      </div>

      {user && user.role === 'admin' && (
        <div>
          <button onClick={handleAddGift}>Add Gift</button>
        </div>
      )}

      {isAddGiftModalOpen && (
        <div className="modal">
          <h2>Add Gift</h2>
          <label>Name:</label>
          <input type="text" value={newGift.name} onChange={(e) => setNewGift({ ...newGift, name: e.target.value })} />
          <label>Price:</label>
          <input type="text" value={newGift.price} onChange={(e) => setNewGift({ ...newGift, price: e.target.value })} />
          <label>Image URL:</label>
          <input type="text" value={newGift.image_url} onChange={(e) => setNewGift({ ...newGift, image_url: e.target.value })} />
          <button onClick={saveGift}>Save</button>
          <button onClick={() => setIsAddGiftModalOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default Gifts;
