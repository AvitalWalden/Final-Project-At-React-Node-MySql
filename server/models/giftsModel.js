const pool = require('../DB.js');

async function getGifts() {
    try {
      const sql = 'SELECT * FROM gifts';
      const result = await pool.query(sql);
      return result[0];
    } catch (err) {
      console.log(err);
      throw err;
    }
  
  }

  
async function getGift(id) {
  try {
    const sql = 'SELECT * FROM gifts where id=?';
    const result = await pool.query(sql, [id]);
    return result[0][0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createGift(name, price, image_url) {
  try {
    const sql = "INSERT INTO gifts (`name`, `price`, `image_url`) VALUES(?, ?, ?)";
    const result = await pool.query(sql, [name, price, image_url]);
    return result[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}


  module.exports = {getGifts,createGift,getGift}