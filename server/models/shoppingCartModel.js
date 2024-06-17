const pool = require('../DB.js');

async function getShoppingCart(userId) {
    try {
        const sql = `
            SELECT 
                g.gift_id,
                g.name,
                g.price,
                g.image_url,
                sc.quantity
            FROM 
                shopping_cart sc
            JOIN 
                gifts g ON sc.gift_id = g.gift_id
            WHERE 
                sc.user_id = ?
        `;
        const [rows, fields] = await pool.query(sql, [userId]);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
async function postShoppingCart(userId, temporaryCart) {
    try {
        console.log(temporaryCart)

        for (const item of temporaryCart) {
            console.log("here")

            const { gift_id, quantity } = item;
            const [existingRows] = await pool.query('SELECT * FROM shopping_cart WHERE user_id = ? AND gift_id = ?', [userId, gift_id]);
            console.log(gift_id, quantity)
            if (existingRows.length > 0) {
                await pool.query('UPDATE shopping_cart SET quantity = quantity + ? WHERE user_id = ? AND gift_id = ?', [quantity, userId, gift_id]);
            } else {
                await pool.query('INSERT INTO shopping_cart (user_id, gift_id, quantity) VALUES (?, ?, ?)', [userId, gift_id, quantity]);
            }
        }
        return { message: 'Shopping cart saved successfully' };
    } catch (err) {
        console.error('Error saving shopping cart:', err);
        throw err;
    }
}

module.exports = { getShoppingCart, postShoppingCart };
