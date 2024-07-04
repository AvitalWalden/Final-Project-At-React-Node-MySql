import React, { useEffect, useState, useContext } from 'react';
import Gift from '../components/Gift';
import '../css/Gifts.css';
import { UserContext } from './UserContext';
import { FaSearch } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { OrderContext } from './OrderContext';
import SideSlidePanel from '../components/SideSlidePanel';
import { MDBContainer, MDBRow, MDBCol, MDBRipple, MDBBtn } from "mdb-react-ui-kit";


function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [isAddGiftModalOpen, setIsAddGiftModalOpen] = useState(false);
  const [newGift, setNewGift] = useState({ name: '', price: '', image_url: '' });
  const [file, setFile] = useState(null);
  const { user, refreshAccessToken } = useContext(UserContext);

  const { order, isOrderListOpen, setIsOrderListOpen, selectedPackage } = useContext(OrderContext);

  useEffect(() => {
    fetch(`http://localhost:3000/gifts`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filteredGifts = data.filter(gift => !gift.winner_id);
          setGifts(filteredGifts);
        } else {
          setGifts([]);
        }
      })
      .catch(error => {
        console.error('Error fetching gifts:', error);
        setGifts([]);
      });
  }, []);

  const handleAddGift = () => {
    setIsAddGiftModalOpen(true);
  };

  const handleUpload = (gift_id) => {
    const formData = new FormData();
    formData.append('image', file);

    fetch(`http://localhost:3000/upload/${gift_id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Accept': 'multipart/form-data',
      },
      credentials: "include",
    })
      .then(async response => {
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Refreshing token and retrying...');
            await refreshAccessToken();
            return handleUpload(gift_id);
          }
          if (response.status === 402) {
            console.log('No acsses...');
            throw response.error;

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

  const saveGift = async () => {
    const url = 'http://localhost:3000/gifts';
    const method = 'POST';
    const giftData = { ...newGift, image_url: '' };
    try {
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
            if (response.status === 402) {
              console.log('NO Acsses...');
              throw response.error;
            }
            if (response.status === 403) {
              console.log('invalid token you cannot do it...');
              throw response.error;
            }
          }

          const data = await response.json();

          if (data && data.gift_id) {
            await handleUpload(data.gift_id);
            setGifts(prevGifts => [...prevGifts, data]);
            setIsAddGiftModalOpen(false);
            setNewGift({ name: '', price: '', image_url: '' });
          } else {
            throw new Error('Invalid response data');
          }

        })
    } catch (error) {
      console.error('Error saving gift:', error);
      alert('There was an error saving the gift. Please try again.');
    }
  };

  return (
    <>
      <div className='topContainer'>
        <div className='searchContainer'>
          <input
            className='inputItem'
            type='text'
            value={searchCriteria}
            placeholder='Search gift'
            onChange={(event) => setSearchCriteria(event.target.value)}
          />
          <FaSearch className='shearch' />
        </div>
        {user && user.role == "admin" && (
          // <button className="btnAdd" onClick={handleAddGift}>Add Gift</button>
          <MDBBtn className='centerB' onClick={handleAddGift}>Add Gift</MDBBtn>

        )}
      </div>
      <div className="gift-containers">
        {Array.isArray(gifts) && gifts.map((gift, index) => (
          <Gift
            key={gift.gift_id}
            gift={gift}
            user={user}
            searchCriteria={searchCriteria}
            setGifts={setGifts}
            gifts={gifts}
            file={file}
            setFile={setFile}
            refreshAccessToken={refreshAccessToken}
            selectedPackage={selectedPackage}
          />
        ))}
      </div>

      <SideSlidePanel orders={order} isOpen={isOrderListOpen} onClose={() => setIsOrderListOpen(false)} />

      {isAddGiftModalOpen && (
        <div className="modal-x-overlay">
          <div className="modal-x">
            <button className="cancel" onClick={() => setIsAddGiftModalOpen(false)}><ImCancelCircle /></button>
            <h2>Edit Gift</h2>
            <label>Name:</label>
            <input type="text" value={newGift.name} onChange={(e) => setNewGift({ ...newGift, name: e.target.value })} />
            <label>Price:</label>
            <input type="text" value={newGift.price} onChange={(e) => setNewGift({ ...newGift, price: e.target.value })} />
            <input className="file" type="file" onChange={(e) => setFile(e.target.files[0])} />
            <div className="modal-x-buttons">
              <MDBBtn className='w-100 mb-4' size='md' onClick={saveGift}>Save</MDBBtn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Gifts;
