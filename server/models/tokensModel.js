const pool = require('../DB.js');

async function updateToken(user_id, refreshToken) {
    try {
        const sqlToken = `UPDATE token SET refreshToken = ? WHERE user_id = ?`;
        const [result] = await pool.query(sqlToken, [refreshToken, user_id]);

        return result;
    } catch (err) {
         console.log('Error updating user:', err);
        throw err;
    }
}

async function creatTokenDB(user_id, refreshToken) {
    try {
        const sqlToken = "INSERT INTO token (user_id, refreshToken) VALUES (?, ?)";
        const [resultToken] = await pool.query(sqlToken, [user_id, refreshToken]);
        const tokenId = resultToken.insertId;
        return tokenId;
    } catch (err) {
         console.log('Error creating user:', err);
        throw err;
    }
}

async function getTokensAndUsers() {
    try {
        const sql = 'SELECT * FROM token NATURAL JOIN users';
        const [result] = await pool.query(sql);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
async function getTokenAndUserByToken(token) {
    try {
        const sql = `
            SELECT * 
            FROM token natural join users natural join addresses
            WHERE token.refreshToken = ?
        `;
        const [result] = await pool.query(sql, [token]);
        return result[0];
    } catch (err) {
         console.log('Error in getTokenAndUserByToken:', err);
        throw err;
    }
}

async function deleteToken(id) {
    try {
        const sql = `UPDATE token SET refreshToken = NULL WHERE user_id = ?`;
        await pool.query(sql, [id]);
    } catch (err) {
         console.log('Error updating token to null:', err);
        throw err;
    }
}


module.exports = { updateToken, creatTokenDB, getTokensAndUsers, deleteToken, getTokenAndUserByToken }
