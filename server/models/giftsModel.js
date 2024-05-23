const pool = require('../DB.js');

async function getGifts() {
    try {
      const sql = 'SELECT * FROM gifts';
      const result = await pool.query(sql);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  
  }

  module.exports = {getGifts}