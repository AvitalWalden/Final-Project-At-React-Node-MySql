import React, { useState, useContext } from 'react';
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { OrderContext } from '../pages/OrderContext';
import '../css/Modal.css'; // תוודא שה-Modal מעוצב לפי התמונה שהעלית

function Gift({ gift, user, searchCriteria, setGifts, gifts ,file,setFile}) {
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
    const gift_id= currentGift.gift_id;
    fetch(`http://localhost:3000/gifts/upload/${gift_id}`, {
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
        setGifts({ ...gift, image_url: data.filename }); // Assuming your API returns the filename
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  const saveGift =  async () => {
    await handleUpload();
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
        const a = gifts.map(g => g.gift_id === data.gift_id ? data : g);
        console.log(a);
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
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          {/* <button onClick={handleUpload}>Upload</button> */}
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
