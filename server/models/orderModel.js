const pool = require('../DB.js');

// async function getOrder(id) {
//     try {
//         const sql =  'SELECT orders.*, FROM orders  gifts ON orders.gift_id = gifts.gift_id JOIN lotteries_tickets ON orders.order_id = lotteries_tickets.order_id WHERE orders.user_id = ?';
//         const result = await pool.query(sql, [id]);
//         return result[0][0];
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }
// async function getOrder(userId) {
//     try {
//         const sql = 'SELECT * FROM orders NATURAL JOIN lotteries_tickets  NATURAL JOIN gifts WHERE orders.user_id = ?';
//         const result = await pool.query(sql, [userId]);
//         return result[0];
//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }

async function getOrder(userId) {
    try {
        const sql = `
            SELECT orders.order_id, GROUP_CONCAT(gifts.name) AS ordered_gifts
            FROM orders
            NATURAL JOIN lotteries_tickets 
            NATURAL JOIN gifts
            WHERE orders.user_id = ?
            GROUP BY orders.order_id;
        `;
        const result = await pool.query(sql, [userId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function getOrderByGiftID(gift_id) {
    try {

        const sql = 'SELECT * FROM orders NATURAL JOIN  lotteries_tickets where lotteries_tickets.gift_id=?';
        const result = await pool.query(sql, [gift_id]);
        console.log(result);
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {getOrder,getOrderByGiftID}
