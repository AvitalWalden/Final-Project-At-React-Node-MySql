const model = require('../models/fundraisersModel');

async function updateFundraisers(updatedFundraiser) {
    try {
        return model.updateFundraisers(updatedFundraiser);
    } catch (err) {
        throw err;
    }
}
async function getFundraiser(fundraiserId) {
    try {
        return model.getFundraiser(fundraiserId);
    } catch (err) {
        throw err;
    }
}
async function getFundraiserChartData() {
    try {
        return model.getFundraiserChartData();
    } catch (err) {
        throw err;
    }
}
module.exports = {updateFundraisers,getFundraiser,getFundraiserChartData}
