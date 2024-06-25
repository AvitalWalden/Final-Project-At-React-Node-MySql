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

async function createUser(username, password, role) {
    try {
        const sqlAddress = "INSERT INTO addresses (city, street, zipcode) VALUES (?, ?, ?)";
        const resultAddress = await pool.query(sqlAddress, ['', '', '']);
        const addressId = resultAddress[0].insertId;
        const sqlUser = "INSERT INTO users (username, address_id,role) VALUES (?, ?,?)";
        const resultUser = await pool.query(sqlUser, [username, addressId,role]);
        const userId = resultUser[0].insertId;
        const sqlPassword = "INSERT INTO passwords (user_id, password) VALUES (?, ?)";
        await pool.query(sqlPassword, [userId, password]);

        return resultUser[0];
    } catch (err) {
        console.error('Error creating user:', err);
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

async function updateUser(id, name, username, email, city, street, zipcode, phone, Bonus, addressId) {
    try {
        const sqlValidateAddress = `SELECT * FROM addresses WHERE address_id = ?`;
        const [addressRows] = await pool.query(sqlValidateAddress, [addressId]);

        if (addressRows.length === 0) {
            throw new Error(`Address ID ${addressId} does not exist`);
        }
        const sqlAddress = `UPDATE addresses SET city = ?, street = ?, zipcode = ? WHERE address_id = ?`;
        await pool.query(sqlAddress, [city, street, zipcode, addressId]);
        const sqlUser = `UPDATE users SET name = ?, username = ?, email = ?, address_id = ?, phone = ?, Bonus = ? WHERE user_id = ?`;
        const resultUser = await pool.query(sqlUser, [name, username, email, addressId, phone, Bonus, id]);

        return resultUser;
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    }
}



module.exports = { updateUser, createUser, getUser, logIn, getUserForSignup }