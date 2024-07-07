const pool = require('../DB.js');

async function getShoppingCart(userId) {
  try {
    const sql = `
            SELECT 
                g.gift_id,
                g.name,
                g.price,
                g.image_url,
                sc.quantity
            FROM 
                shopping_cart sc
            JOIN 
                gifts g ON sc.gift_id = g.gift_id
            WHERE 
                sc.user_id = ?
        `;
    const [rows, fields] = await pool.query(sql, [userId]);
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function postShoppingCart(userId, temporaryCart) {


  for (const item of temporaryCart) {
    try {
      const { gift_id, quantity } = item;
      const [existingRows] = await pool.query('SELECT * FROM shopping_cart WHERE user_id = ? AND gift_id = ?', [userId, gift_id]);
      if (existingRows.length > 0) {
        await pool.query('UPDATE shopping_cart SET quantity = quantity + ? WHERE user_id = ? AND gift_id = ?', [quantity, userId, gift_id]);
      } else {
        await pool.query('INSERT INTO shopping_cart (user_id, gift_id, quantity) VALUES (?, ?, ?)', [userId, gift_id, quantity]);
      }
    } catch (err) {
      console.error('Error saving shopping cart:', err);
      throw err;
    }
  }

  return { message: 'Shopping cart saved successfully' };
}

async function deleteShoppingCart(userId, giftIds) {
  try {
    const query = 'DELETE FROM shopping_cart WHERE user_id = ? AND gift_id IN (?)';
    const result = await pool.query(query, [userId, giftIds]);

    if (result.affectedRows > 0) {
      return { message: 'Gifts deleted from shopping cart successfully' };
    } else {
      return { message: 'Gifts not found in shopping cart' };
    }
  } catch (err) {
    console.error('Error deleting gifts from shopping cart:', err);
    throw err;
  }
}


async function putShoppingCart(userId, giftId, newQuantity) {
  try {
    const [existingRows] = await pool.query('SELECT * FROM shopping_cart WHERE user_id = ? AND gift_id = ?', [userId, giftId]);

    if (existingRows.length > 0) {
      await pool.query('UPDATE shopping_cart SET quantity = ? WHERE user_id = ? AND gift_id = ?', [newQuantity, userId, giftId]);
      return { message: 'Gift quantity updated in shopping cart successfully' };
    } else {
      await pool.query('INSERT INTO shopping_cart (user_id, gift_id, quantity) VALUES (?, ?, ?)', [userId, giftId, newQuantity]);
      return { message: 'Gift added to shopping cart successfully' };
    }
  } catch (err) {
    console.error('Error updating shopping cart:', err);
    throw err;
  }
}
module.exports = { getShoppingCart, postShoppingCart, deleteShoppingCart, putShoppingCart };
