import React, { useState, useContext } from 'react';
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { OrderContext } from '../pages/OrderContext';
import '../css/Modal.css'; // תוודא שה-Modal מעוצב לפי התמונה שהעלית
import '../css/Gift.css';
import '../css/Gifts.css';

import { ImCancelCircle } from "react-icons/im";



function Gift({ gift, user, searchCriteria, setGifts, gifts, file, setFile }) {
  const { addToOrder } = useContext(OrderContext);
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
        const updatedgifts = gifts.filter((gift) => gift.gift_id !== gift_id);
        setGifts(updatedgifts);
      })
  };

  const handleAddGift = () => {
    addToOrder(gift)
  };

  const handleEditGift = () => {
    setIsEditGiftModalOpen(true);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('image', file);
    const gift_id = currentGift.gift_id;
    fetch(`http://localhost:3000/upload/${gift_id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Accept': 'multipart/form-data',
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        console.log('File uploaded successfully', data);
        setGifts(prevGifts =>
          prevGifts.map(gift =>
            gift.gift_id === data.gift_id ? data : gift
          )
        );
      })
      .catch(error => {
        console.error('Error uploading file:', error);

      });
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
        handleUpload(data.gift_id);
        const a = gifts.map(g => g.gift_id === data.gift_id ? data : g);
        setGifts(a);
        setIsEditGiftModalOpen(false);
      });
  };

  return (
    <>
      {(gift.name.toLowerCase().includes(searchCriteria) || gift.name.toUpperCase().includes(searchCriteria) || gift.price.toString().includes(searchCriteria)) &&
        <div className="gift-card">
          <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
          <h1>{highlightSearchTerm(gift.name)}</h1>
          <h1>{highlightSearchTerm(gift.price)}$</h1>
          <div className='giftButtons'>
            {user && user.role === 'admin' && (
              <div className="btn-admin">
                <button className="btnDeleteGift" onClick={() => handleDeleteGift(gift.gift_id)}><MdDeleteForever /></button>
                <button className="btnEditGift" onClick={handleEditGift}><MdEdit /></button>
              </div>
            )}
            <button className="btnAddGift" onClick={handleAddGift}>Add To Cart</button>
          </div>
        </div>
      }
      {isEditGiftModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Gift</h2>
            <label>Name:</label>
            <input type="text" value={currentGift.name} onChange={(e) => setCurrentGift({ ...currentGift, name: e.target.value })} />
            <label>Price:</label>
            <input type="text" value={currentGift.price} onChange={(e) => setCurrentGift({ ...currentGift, price: e.target.value })} />
            <input className="file" type="file" onChange={(e) => setFile(e.target.files[0])} />
            <div className="modal-buttons">
              <button className="save" onClick={saveGift}>Save</button>
              <button className="cancel" onClick={() => setIsEditGiftModalOpen(false)}><ImCancelCircle />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Gift;
