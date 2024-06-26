const pool = require('../DB.js');

async function getPackages() {
    try {
        const sql = `SELECT * FROM packages`;
        const [result] = await pool.query(sql);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
module.exports = {getPackages}
