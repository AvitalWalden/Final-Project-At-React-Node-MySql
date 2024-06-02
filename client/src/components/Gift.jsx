import React from 'react'
import { MdDeleteForever } from "react-icons/md";



function Gift({ gift,user }) {
  return (
    <div className="gift-card">
      <img src={gift.image_url} alt={gift.name} />
      {/* <h1>{gift.gift_id}</h1> */}
      <h1>{gift.name}</h1>
      <h1>{gift.price}</h1>
      {user && user.role === 'admin' && (
        <button className="btnDelete" /*onClick={handleDeleteGift}*/><MdDeleteForever /></button>
      )}
      <button className="btnAdd" /*onClick={handleAddGift}*/>Add+</button>
    </div>
  )
  
}

export default Gift
