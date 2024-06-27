const model = require('../models/fundraisersModel');

async function updateFundraisers(updatedFundraiser) {
    try {
        return model.updateFundraisers(updatedFundraiser);
    } catch (err) {
        throw err;
    }
}
module.exports = {updateFundraisers}
