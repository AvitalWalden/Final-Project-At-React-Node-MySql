const pool = require('../DB.js');

async function updateImage(image,gift_id) {
    try {
        console.log(image)
        const sql = 'update gifts set image_url =? where gift_id = ?'
        const result = pool.query(sql, [image, gift_id]);
        console.log(result[0])
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }

}
module.exports = {updateImage}