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

async function getOrders() {
    try {
        const sql = `SELECT * FROM orders`
        const result = await pool.query(sql);
        return result[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getOrder(userId) {
    try {
        const sql = `
            SELECT 
                orders.order_id, 
                orders.order_date, 
                gifts.name, 
                gifts.price 
            FROM 
                orders 
            JOIN 
                lotteries_tickets ON orders.order_id = lotteries_tickets.order_id
            JOIN 
                gifts ON lotteries_tickets.gift_id = gifts.gift_id
            WHERE 
                orders.user_id = ?
        `;
        const [rows] = await pool.query(sql, [userId]);
        console.log(rows); // Log the rows to check the returned data structure
        return rows;
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

async function getOrderByOrderId(order_id) {
    try {

        const sql = 'SELECT * FROM orders NATURAL JOIN  lotteries_tickets where lotteries_tickets.order_id=?';
        const result = await pool.query(sql, [order_id]);
        return result[0][0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}
async function createOrder(user_id, order_date, order) {
    try {
        const sqlOrder = "INSERT INTO orders (user_id, order_date) VALUES (?, ?)";
        const resultOrder = await pool.query(sqlOrder, [user_id, order_date]);
        const orderId = resultOrder[0].insertId;

        const sqlTickets = "INSERT INTO lotteries_tickets (order_id, quantity, gift_id) VALUES ?";
        const ticketsData = order.map(item => [orderId, item.quantity, item.gift_id]);
        await pool.query(sqlTickets, [ticketsData]);        
        return { orderId, user_id, order_date, order };

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = {getOrder,getOrderByGiftID,createOrder,getOrderByOrderId,getOrders}
