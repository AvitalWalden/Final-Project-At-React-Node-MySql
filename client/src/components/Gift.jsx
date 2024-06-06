import React, { useContext } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { OrderContext } from '../pages/OrderContext';

function Gift({ gift, user, searchCriteria, setGifts, giftes }) {
  const { addOrder } = useContext(OrderContext);

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
        // navigate(`../users/${todo.userId}/todos`);
      })
  };

  const handleAddGift = () => {
  };

  return (
    <>
      {(gift.name.toLowerCase().includes(searchCriteria) || gift.name.toUpperCase().includes(searchCriteria) || gift.price.toString().includes(searchCriteria)) &&
        <div className="gift-card">
          <img src={`/images/${gift.image_url}`} alt={gift.name} />
          <h1>{highlightSearchTerm(gift.name)}</h1>
          <h1>{highlightSearchTerm(gift.price)}</h1>
          {user && user.role === 'admin' && (
            <button className="btnDelete" onClick={()=>handleDeleteGift(gift.gift_id)}><MdDeleteForever /></button>
          )}
          <button className="btnAdd" onClick={handleAddGift}><IoMdAdd /></button>
        </div>
      }
    </>
  );
}

export default Gift;
