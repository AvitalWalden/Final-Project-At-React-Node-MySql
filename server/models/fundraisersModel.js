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

module.exports = {updateFundraisers}
