import React, { useState, useContext } from 'react';
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { OrderContext } from '../pages/OrderContext';
import '../css/Modal.css'; // תוודא שה-Modal מעוצב לפי התמונה שהעלית

function Gift({ gift, user, searchCriteria, setGifts, giftes }) {
  const { addOrder } = useContext(OrderContext);
  const [isEditGiftModalOpen, setIsEditGiftModalOpen] = useState(false);
  const [currentGift, setCurrentGift] = useState(gift);

  const highlightSearchTerm = (title) => {
    const index = title.toLowerCase().indexOf(searchCriteria.toLowerCase());
    if (index !== -1) {
      return (
        <span>
          {title.substring(0, index)}
          <strong className="searchTitle">{title.substring(index, index + searchCriteria.length)}</strong>
          {title.substring(index + searchCriteria.length)}
        </span>
      );
    }
    return title;
  };

  const handleDeleteGift = (gift_id) => {
    fetch(`http://localhost:3000/gifts/${gift_id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedGiftes = giftes.filter((gift) => gift.gift_id !== gift_id);
        setGifts(updatedGiftes);
      })
  };

  const handleAddGift = () => {
    addOrder(gift)
  };

  const handleEditGift = () => {
    setIsEditGiftModalOpen(true);
  };

  const saveGift = () => {
    const url = `http://localhost:3000/gifts/${currentGift.gift_id}`;
    const method = 'PUT';
    const giftData = currentGift;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(giftData)
    })
      .then(res => res.json())
      .then(data => {
        setGifts(giftes.map(g => g.gift_id === giftData.gift_id ? giftData : g));
        setIsEditGiftModalOpen(false);
      });
  };

  return (
    <>
      {(gift.name.toLowerCase().includes(searchCriteria) || gift.name.toUpperCase().includes(searchCriteria) || gift.price.toString().includes(searchCriteria)) &&
        <div className="gift-card">
          <img src={`/images/${gift.image_url}`} alt={gift.name} />
          <h1>{highlightSearchTerm(gift.name)}</h1>
          <h1>{highlightSearchTerm(gift.price)}</h1>
          {user && user.role === 'admin' && (
            <>
              <button className="btnDelete" onClick={() => handleDeleteGift(gift.gift_id)}><MdDeleteForever /></button>
              <button className="btnEdit" onClick={handleEditGift}><MdEdit /></button>
            </>
          )}
          <button className="btnAdd" onClick={handleAddGift}><IoMdAdd /></button>
        </div>
      }

      {isEditGiftModalOpen && (
        <div className="modal">
          <h2>Edit Gift</h2>
          <label>Name:</label>
          <input type="text" value={currentGift.name} onChange={(e) => setCurrentGift({ ...currentGift, name: e.target.value })} />
          <label>Price:</label>
          <input type="text" value={currentGift.price} onChange={(e) => setCurrentGift({ ...currentGift, price: e.target.value })} />
          <label>Image URL:</label>
          <input type="text" value={currentGift.image_url} onChange={(e) => setCurrentGift({ ...currentGift, image_url: e.target.value })} />
          <button onClick={saveGift}>Save</button>
          <button onClick={() => setIsEditGiftModalOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default Gift;
