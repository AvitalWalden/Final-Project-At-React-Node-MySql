import React from 'react'


function Gift({ gift, searchCriteria }) {

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

  return (
    <>
      {(gift.name.toLowerCase().includes(searchCriteria) || gift.name.toUpperCase().includes(searchCriteria) || gift.price.toString().includes(searchCriteria)) &&
        <div className="gift-card">
          <img src={gift.image_url} alt={gift.name} />
          <h1>{highlightSearchTerm(gift.name)}</h1>
          <h1>{highlightSearchTerm(gift.price)}</h1>
          <button className="btnAdd" /*onClick={handleAddGift}*/>Add+</button><br />
        </div>
      }
    </>
  )
}

export default Gift
