import React, { useEffect, useState, useContext } from 'react';
import Gift from '../components/Gift';
import '../css/Gifts.css';
import { UserContext } from './UserContext';
import { FaSearch } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";



function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [isAddGiftModalOpen, setIsAddGiftModalOpen] = useState(false);
  const [newGift, setNewGift] = useState({ name: '', price: '', image_url: '' });
  const [file, setFile] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const url = `http://localhost:3000/gifts`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filteredGifts = data.filter(gift => !gift.winner_id);
          setGifts(filteredGifts);
        } else {
          setGifts([]); // Ensure it's an array
        }
      })
      .catch(error => {
        console.error('Error fetching gifts:', error);
        setGifts([]); // Ensure it's an array in case of error
      });
  }, []);

  const handleAddGift = () => {
    setIsAddGiftModalOpen(true);
  };

  const handleUpload = ((gift_id) => {
    const formData = new FormData();
    formData.append('image', file);

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
  });

  const saveGift = async () => {
    const url = 'http://localhost:3000/gifts';
    const method = 'POST';
    const giftData = { ...newGift, image_url: '' };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(giftData)
    })
      .then(res => res.json())
      .then(data => {
        setGifts(prevGifts => [...prevGifts, data]);
        handleUpload(data.gift_id);
        setIsAddGiftModalOpen(false);
        setNewGift({ name: '', price: '', image_url: '' });
      })
      .catch(error => {
        console.error('Error saving gift:', error);
      });
  };

  return (
    <>
      <input
        className='inputItem'
        type="text"
        value={searchCriteria}
        placeholder={`${<FaSearch />}`}
        onChange={(event) => setSearchCriteria(event.target.value)}
      />
      <div className="gift-container">
        {Array.isArray(gifts) && gifts.map((gift, index) => (
          <Gift
            key={index}
            gift={gift}
            user={user}
            searchCriteria={searchCriteria}
            setGifts={setGifts}
            gifts={gifts}
            file={file}
            setFile={setFile}
          />
        ))}
      </div>

      {user && user.role === 'admin' && (
        <div>
          <button onClick={handleAddGift}>Add Gift</button>
        </div>
      )}

      {isAddGiftModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Gift</h2>
            <label>Name:</label>
            <input type="text" value={newGift.name} onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}/>
            <label>Price:</label>
            <input type="text" value={newGift.price} onChange={(e) => setNewGift({ ...newGift, price: e.target.value })}/>
            <input className="file" type="file" onChange={(e) => setFile(e.target.files[0])} />
            <div className="modal-buttons">
              <button onClick={saveGift}>Save</button>
              <button className ="cancel"onClick={() => setIsAddGiftModalOpen(false)}><ImCancelCircle />
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Gifts;
