const pool = require('../DB.js');

async function updateToken(user_id, refreshToken) {
    try {
        console.log(refreshToken);
        const sqlToken = `UPDATE token SET refreshToken = ? WHERE user_id = ?`;
        const [result] = await pool.query(sqlToken, [refreshToken, user_id]);

        return result;
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
}

async function creatToken(user_id, refreshToken) {
    try {
        const sqlToken = "INSERT INTO token (user_id, refreshToken) VALUES (?, ?)";
        const [resultToken] = await pool.query(sqlToken, [user_id, refreshToken]);
        const tokenId = resultToken.insertId;
        return tokenId;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}

async function getTokenAndUser() {
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
        const sql = 'SELECT * FROM token NATURAL JOIN users WHERE refreshToken = ?';
        const [result] = await pool.query(sql, [token]);
        return result;
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
        console.error('Error deleting token:', err);
        throw err;
    }
}

module.exports = { updateToken, creatToken, getTokenAndUser, deleteToken, getTokenAndUserByToken }
