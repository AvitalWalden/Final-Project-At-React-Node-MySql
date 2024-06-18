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

async function getGiftsWithUserDetails() {
  try {
    const sql = 'SELECT  gifts.name AS gift_name, gifts.*, users.* FROM gifts JOIN users ON gifts.winner_id = users.user_id';
    const result = await pool.query(sql);
    console.log(result)
    return result[0];
  } catch (err) {
    console.log(err);
    throw err;
  }

}



async function getGift(id) {
  try {
    
    const sql = 'SELECT * FROM gifts where gift_id=?';
    const result = await pool.query(sql, [id]);
    console.log(result);

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

async function deleteGift(id) {
  try {
    const sql = `DELETE FROM gifts WHERE gift_id = ?`;
    await pool.query(sql, [id]);
  } catch (err) {
    console.error('Error deleting gift:', err);
    throw err;
  }
}

async function updateWinnerOfGift(id,winner_id,name,price, image_url) {
  try {
    const sql = `UPDATE gifts SET winner_id = ? ,name = ?,price = ? ,image_url = ? WHERE gift_id = ?`;
    const result = await pool.query(sql, [winner_id,name,price, image_url, id]);
    return result;
  } catch (err) {
    console.error('Error deleting gift:', err);
    throw err;
  }
}
module.exports = { getGifts, createGift, getGift, deleteGift, getGiftsWithUserDetails ,updateWinnerOfGift}