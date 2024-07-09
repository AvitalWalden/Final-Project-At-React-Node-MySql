import React, { useEffect, useState, useContext } from 'react';
import Gift from '../components/Gift';
import '../css/Gifts.css';
import { UserContext } from './UserContext';
import { FaSearch } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { OrderContext } from './OrderContext';
import SideSlidePanel from '../components/SideSlidePanel';
import { MDBBtn } from "mdb-react-ui-kit";


function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [isAddGiftModalOpen, setIsAddGiftModalOpen] = useState(false);
  const [newGift, setNewGift] = useState({ name: '', price: '', image_url: '' });
  const [file, setFile] = useState(null);
  const { user, refreshAccessToken } = useContext(UserContext);
  const [error, setError] = useState('');
  const { order, isOrderListOpen, setIsOrderListOpen, selectedPackage } = useContext(OrderContext);

  const handleAddGift = () => {
    setIsAddGiftModalOpen(true);
  };

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
        console.log('Error fetching gifts:', error);
        setGifts([]);
      });
  }, []);

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
            console.log('NO Acsses...');
            setError("NO Acsses...");
            return;
          }
          if (response.status === 403) {
            console.log('invalid token you cannot do it...');
            setError('invalid token you cannot do it...');
            return;
          }
          if (response.status === 400) {
            console.log("Fill in the data")
            setError("Fill in the data");
            return;
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
        console.log('Error uploading file:', error);
      });
  };

  const saveGift = async () => {
    if (!file || !newGift.price || !newGift.name) {
      setError('Please fill in all fields.');
      return;
    }

    const url = 'http://localhost:3000/gifts';
    const method = 'POST';
    const giftData = { ...newGift, image_url: '' };

    try {
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(giftData)
      }).then(async response => {
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Refreshing token and retrying...');
            await refreshAccessToken();
            return saveGift();
          }
          if (response.status === 402) {
            setError("NO Acsses...");
            return;
          }
          if (response.status === 403) {
            setError('invalid token you cannot do it...');
            return;
          }
          if (response.status === 400) {
            setError("Fill in the data");
            return;
          }
        } else {
          const data = await response.json();
          if (data && data.gift_id) {
            setGifts(prevGifts => [...prevGifts, data]);
            await handleUpload(data.gift_id);
            setError('');
            setFile(null);
            setIsAddGiftModalOpen(false);
            setNewGift({ name: '', price: '', image_url: '' });
          } else {
            setError("Invalid response data");
          }
        }
      })
    } catch (error) {
      console.log('There was an error saving the gift. Please try again.');
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
            <h2>Add Gift</h2>
            <label>Name:</label>
            <input type="text" value={newGift.name} onChange={(e) => setNewGift({ ...newGift, name: e.target.value })} />
            <label>Price:</label>
            <input type="text" value={newGift.price} onChange={(e) => setNewGift({ ...newGift, price: e.target.value })} />
            <input className="file" type="file" onChange={(e) => setFile(e.target.files[0])} />
            <div className="modal-x-buttons">
              <MDBBtn className='w-100 mb-4' size='md' onClick={saveGift}>Save</MDBBtn>
            </div>
            {error && <p className='error mt-4' style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default Gifts;
