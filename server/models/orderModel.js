const pool = require('../DB.js');

async function getOrder(id) {
    try {

        const sql = 'SELECT * FROM orders natural join gifts where orders.user_id=?';
        const result = await pool.query(sql, [id]);
        console.log(result[0][0])
        return result[0][0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}


async function getOrderByGiftID(gift_id) {
    try {

        const sql = 'SELECT * FROM orders where orders.gift_id=?';
        const result = await pool.query(sql, [gift_id]);
        return result[0][0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {getOrder,getOrderByGiftID}
