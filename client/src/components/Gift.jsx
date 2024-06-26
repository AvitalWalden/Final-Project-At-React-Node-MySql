import React, { useState, useContext } from 'react';
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { OrderContext } from '../pages/OrderContext';
import { UserContext } from '../pages/UserContext';
import '../css/Modal.css'; // תוודא שה-Modal מעוצב לפי התמונה שהעלית
import '../css/Gift.css';
import '../css/Gifts.css';
import { ImCancelCircle } from "react-icons/im";



function Gift({ gift, user, searchCriteria, setGifts, gifts, file, setFile, refreshAccessToken }) {
  const { addToOrder, selectedPackage, order } = useContext(OrderContext);
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
      credentials: "include",
    })
      .then(async response => {
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Refreshing token and retrying...');
            await refreshAccessToken();
            return handleDeleteGift(gift_id); // Retry fetch after token refresh
          }
          if (response.status === 403) {
            console.log('invalid token you cannot do it...');
            throw response.error;
          }
        }
      })
      .then(() => {
        const updatedgifts = gifts.filter((gift) => gift.gift_id !== gift_id);
        setGifts(updatedgifts);
      })

  };

  const handleAddGift = (checkbox) => {
    addToOrder(gift, checkbox)
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
      .then(async response => {
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Refreshing token and retrying...');
            await refreshAccessToken();
            return handleUpload(gift_id); // Retry fetch after token refresh
          }
          if (response.status === 403) {
            console.log('invalid token you cannot do it...');
            throw response.error;
          }
        }
        return await response.json();
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
    try {
      const url = `http://localhost:3000/gifts/${currentGift.gift_id}`;
      const method = 'PUT';
      const giftData = currentGift;

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(giftData)
      })
        .then(async response => {
          if (!response.ok) {
            if (response.status === 401) {
              console.log('Refreshing token and retrying...');
              await refreshAccessToken();
              return saveGift(); // Retry fetch after token refresh
            }

            if (response.status === 403) {
              console.log('invalid token you cannot do it...');
              throw response.error;
            }
          }
          handleUpload(currentGift.gift_id);
          const updateGift = gifts.map(g => g.gift_id === currentGift.gift_id ? currentGift : g);
          setGifts(updateGift);
          setIsEditGiftModalOpen(false);
        });
    } catch {
      console.error('Error adding gift:');
    }
  };

  return (
    <>
      {(gift.name.toLowerCase().includes(searchCriteria) || gift.name.toUpperCase().includes(searchCriteria) || gift.price.toString().includes(searchCriteria)) &&
        <div className="gift-card">
          <img src={`http://localhost:3000/images/${gift.image_url}`} alt={gift.name} />
          <h1>{highlightSearchTerm(gift.name)}</h1>
          <h1>{highlightSearchTerm(gift.price)}$</h1>
          <div className='giftButtons'>
            {user && user.role == "admin" && (
              <div className="btn-admin">
                <button className="btnDeleteGift" onClick={() => handleDeleteGift(gift.gift_id)}><MdDeleteForever /></button>
                <button className="btnEditGift" onClick={handleEditGift}><MdEdit /></button>
              </div>
            )}
            <button className="btnAddGift" onClick={() => handleAddGift(true)}>Add To Cart</button>
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
