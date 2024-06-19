const pool = require('../DB.js');

async function updateToken(id, refreshToken) {
    try {       
        const sqlToken = `UPDATE token SET refreshToken = ? WHERE user_id = ?`;
        const result  = await pool.query(sqlAddress, [sqlToken, user_id ]);

        return result;
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
}

async function creatToken(user_id, refreshToken) {
    try {
        console.log("ddddddddd" +refreshToken);
        const sqlToken = "INSERT INTO token (user_id,refreshToken) VALUES (?,?)";
        const resultToken = await pool.query(sqlToken, [user_id,refreshToken]);
        const tokenId = resultToken[0].insertId;
        return tokenId;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}


async function getTokenAndUser() {
    try {
        const sql = 'SELECT * FROM token natural join user';
        const result = await pool.query(sql);
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function deleteToken(id) {
    try {
      const sql = `DELETE FROM token WHERE user_id = ?`;
      await pool.query(sql, [id]);
    } catch (err) {
      console.error('Error deleting gift:', err);
      throw err;
    }
  }
  
module.exports = { updateToken,creatToken ,getTokenAndUser,deleteToken}