const pool = require('../DB.js');

async function updateImage(image, gift_id) {
    try {
        const sql = 'update gifts set image_url = ? where gift_id = ?';
        const [result] = await pool.query(sql, [image, gift_id]);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = {updateImage}