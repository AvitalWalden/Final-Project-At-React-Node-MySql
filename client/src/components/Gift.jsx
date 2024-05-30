import React from 'react'


function Gift({ gift }) {
  return (
    <div className="gift-card">
      <img src={gift.image_url} alt={gift.name} />
      {/* <h1>{gift.gift_id}</h1> */}
      <h1>{gift.name}</h1>
      <h1>{gift.price}</h1>
      <button className="btnAdd" /*onClick={handleAddGift}*/>Add+</button><br />
    </div>
  )
}

export default Gift
