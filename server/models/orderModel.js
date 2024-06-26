const pool = require('../DB.js');

async function getOrders() {
    try {
        const sql = `
            SELECT orders.order_id, orders.user_id, orders.order_date, users.username 
            FROM orders 
            JOIN users ON orders.user_id = users.user_id;
        `;
        const [result] = await pool.query(sql);
        return result;
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
async function getOrderAndUserByOrderId(order_id) {
    try {
        const sql = `
            SELECT 
                users.user_id,
                users.name,
                users.username,
                users.email,
                users.phone,
                users.Bonus,
                users.role,
                addresses.city,
                addresses.street,
                addresses.zipcode,
                orders.order_id,
                orders.order_date,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'gift_id', gifts.gift_id,
                        'name', gifts.name,
                        'price', gifts.price,
                        'image_url', gifts.image_url
                    )
                ) AS gifts
            FROM 
                orders
            JOIN 
                users ON orders.user_id = users.user_id
            JOIN 
                addresses ON users.address_id = addresses.address_id
            JOIN 
                lotteries_tickets ON orders.order_id = lotteries_tickets.order_id
            JOIN 
                gifts ON lotteries_tickets.gift_id = gifts.gift_id
            WHERE 
                orders.order_id = ?
            GROUP BY 
                orders.order_id;
        `;

        const result = await pool.query(sql, [order_id]);
        return result[0][0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}


module.exports = {getOrder,getOrderByGiftID,createOrder,getOrderByOrderId,getOrders,getOrderAndUserByOrderId}
