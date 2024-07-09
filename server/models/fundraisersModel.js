const pool = require('../DB.js');

async function updateFundraiserForStatus(updatedFundraiser) {
    try {

        const sql = `
            UPDATE fundraisers
            SET debt = ?, people_fundraised = ?, bonus = ?, status=?
            WHERE user_id = ?
        `;
        const values = [
            updatedFundraiser.debt,
            updatedFundraiser.people_fundraised,
            updatedFundraiser.bonus,
            updatedFundraiser.status,
            updatedFundraiser.user_id,
        ];

        const result = await pool.query(sql, values); 
        return result;
    } catch (error) {
         console.log('Error updating fundraiser:', error.message);
        throw error;
    }
}
async function updatedFundraiser(updatedFundraiser) {
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
            updatedFundraiser.user_id,
        ];

        const result = await pool.query(sql, values); 
        return result;
    } catch (error) {
         console.log('Error updating fundraiser:', error.message);
        throw error;
    }
}
async function getFundraiser(fundraiserId) {
    try {

        const sql = 'SELECT * FROM fundraisers natural join users where user_id=?';
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
        return rows;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
async function postFundraiser(userId,bonus,debt,peopleFundraised) {
    try {
        
        const sql = "INSERT INTO fundraisers (`user_id`, `bonus`, `debt`,`people_fundraised`) VALUES(?, ?, ?,?)";
        const result = await pool.query(sql, [userId, bonus, debt,peopleFundraised]);
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}
async function getFundraisers() {
    try {

        const sql = 'SELECT * FROM fundraisers natural join users';
        const result = await pool.query(sql);
        return result[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = { updatedFundraiser, getFundraiser,getFundraiserChartData,postFundraiser ,getFundraisers,updateFundraiserForStatus}
