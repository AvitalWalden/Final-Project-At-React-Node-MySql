const pool = require('../DB.js');

async function updateFundraisers(updatedFundraiser) {
    try {
        const sql = `
            UPDATE fundraisers
            SET debt = ?, people_fundraised = ?, bonus = ?
            WHERE user_id = ?
        `;
        const values = [
            updatedFundraiser.debt,
            updatedFundraiser.people_fundraised,
            updatedFundraiser.bonus,
            updatedFundraiser.user_id
        ];

        const result = await pool.query(sql, values);
        return result;
    } catch (error) {
        console.error('Error updating fundraiser:', error.message);
        throw error;
    }
}
async function getFundraiser(fundraiserId) {
    try {

        const sql = 'SELECT * FROM fundraisers where user_id=?';
        const result = await pool.query(sql, [fundraiserId]);
        return result[0][0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}
async function getFundraiserChartData() {
    try {

        const sql = 'SELECT fundraisers.*, users.name as fundraiser_name FROM fundraisers JOIN users ON fundraisers.user_id = users.user_id';
        const [rows] = await pool.query(sql);
        console.log("pppp",rows)
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = { updateFundraisers, getFundraiser,getFundraiserChartData }
