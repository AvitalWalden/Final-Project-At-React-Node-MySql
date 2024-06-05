const pool = require('../DB.js');

async function getUser(id) {
    try {
        const sql = 'SELECT * FROM users natural join addresses where users.user_id=?';
        const result = await pool.query(sql, [id]);
        return result[0][0];
    } catch (err) {
        console.log(err);
        return err;
    }
}

async function getUserForSignup(id) {
    try {
        const sql = 'SELECT * FROM users where user_id=?';
        const result = await pool.query(sql, [id]);
        return result[0][0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function createUser(username, password) {
    try {
        console.log("aaa");

        const sql = "INSERT INTO users (`username`) VALUES( ?)";
        const result = await pool.query(sql, [username]);
        const id = result[0].insertId;
        console.log(id);

        const sqlPassword = "INSERT INTO passwords (`user_id`,`password`) VALUES(?,?)";
        await pool.query(sqlPassword, [id, password]);
        console.log(result[0]);
        return result[0];

    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function logIn(userName) {
    try {
        const sql = 'SELECT * FROM users natural join passwords where username=?';
        const result = await pool.query(sql, [userName]);
        return result[0][0];

    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function updateUser(id, name, username, email, city, street, zipcode, phone, Bonus, role) {
    try {
        const sqlAddress = "INSERT INTO addresses (`city`, `street`, `zipcode`) VALUES(?, ?, ?)";
        const resultAddress = await pool.query(sqlAddress, [city, street, zipcode]);
        const address_id = resultAddress[0].insertId;
        const sql = `UPDATE users SET name = ?, username = ?, email = ?, address_id = ?, phone = ?, Bonus = ?, role = ? WHERE user_id = ?`;
        const result = await pool.query(sql, [name, username, email, address_id, phone, Bonus, role, id]);
        return result;
    } catch (err) {
        console.error('Error updating branch:', err);
        throw err;
    }
}


module.exports = { updateUser, createUser, getUser, logIn, getUserForSignup }