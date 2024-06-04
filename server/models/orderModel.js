const pool = require('../DB.js');

async function getOrder(id) {
    try {

        const sql = 'SELECT * FROM orders natural join gifts where orders.user_id=?';
        const result = await pool.query(sql, [id]);
        return result[0][0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = {getOrder}
