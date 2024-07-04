import React, { useState, useContext } from 'react';
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { OrderContext } from '../pages/OrderContext';
import { UserContext } from '../pages/UserContext';
import '../css/Modal.css'; // תוודא שה-Modal מעוצב לפי התמונה שהעלית
import '../css/Gift.css';
import '../css/Gifts.css';
import { ImCancelCircle } from "react-icons/im";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBRipple,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput
} from "mdb-react-ui-kit";
import { FaCartPlus } from "react-icons/fa6";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
// import DeleteIcon from '@mui/icons-material/Delete';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { AiFillEdit } from "react-icons/ai";



// ... שאר הקוד של Gift.jsx



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
      .catch(err => {
        console.log(err);
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
          <h1 className='name'>{highlightSearchTerm(gift.name)}</h1>
          <h1 className='price'>{highlightSearchTerm(gift.price)}$</h1>
          <div className='giftButtons'>
            {user && user.role == "admin" && (
              // <div className="btn-admin">
              //   <button className="btnDeleteGift" onClick={() => handleDeleteGift(gift.gift_id)}><MdDeleteForever /></button>
              //   <button className="btnEditGift" onClick={handleEditGift}><MdEdit /></button>
              // </div>
               <Stack direction="row" spacing={1}>
               <IconButton aria-label="Edit"  color="primary" onClick={handleEditGift}>
               <AiFillEdit />
               </IconButton>
               <IconButton aria-label="delete"  color="primary" onClick={() => handleDeleteGift(gift.gift_id)}>
               <MdDelete />
               </IconButton>
             </Stack>
            )}
            <IconButton color="primary" aria-label="add to shopping cart" onClick={() => handleAddGift(true)}>
            <FaCartPlus />
            </IconButton>
          </div>
        </div>
      }
      {isEditGiftModalOpen && (
        <div className="modal-x-overlay">
          <div className="modal-x">
              <button className="cancel" onClick={() => setIsEditGiftModalOpen(false)}><ImCancelCircle />  </button>
            <h2 className='h2'>Edit Gift</h2>
            <label>Name:</label>
            <input type="text" value={currentGift.name} onChange={(e) => setCurrentGift({ ...currentGift, name: e.target.value })} />
            <label>Price:</label>
            <input type="text" value={currentGift.price} onChange={(e) => setCurrentGift({ ...currentGift, price: e.target.value })} />
            <input className="file" type="file" onChange={(e) => setFile(e.target.files[0])} />
            <div className="modal-x-buttons">
            <MDBBtn className='w-100 mb-4' size='md' onClick={saveGift}>Save</MDBBtn>
            </div>
          </div>
        </div>
        //   <div className="modal-x-overlay">
        //   <div className="modal-x">
        //     <button className="cancel" onClick={() => setIsAddGiftModalOpen(false)}><ImCancelCircle /></button>
        //     {/* <h2>Add Gift</h2>
        //     <MDBInput wrapperClass='mb-4' label='Name' id='form1 Name' type='text' value={newGift.name} onChange={(e) => setNewGift({ ...newGift, name: e.target.value })} />
        //       <MDBInput wrapperClass='mb-4' label='Price' id='form1 Price' type='text' value={newGift.price} onChange={(e) => setNewGift({ ...newGift, price: e.target.value })} />
        //      */}
        //     <label>Name:</label>
        //     <input type="text" value={newGift.name} onChange={(e) => setNewGift({ ...newGift, name: e.target.value })} />
        //     <label>Price:</label>
        //     <input type="text" value={newGift.price} onChange={(e) => setNewGift({ ...newGift, price: e.target.value })} />
        //     <input className="file" type="file" onChange={(e) => setFile(e.target.files[0])} />
        //     <div className="modal-x-buttons">
        //       <MDBBtn className='w-100 mb-4' size='md' onClick={saveGift}>Save</MDBBtn>
        //     </div>
        //   </div>
        // </div>
      )}
    </>
  );
}

export default Gift;
