const model = require('../models/fundraisersModel');
const { sendFundraiserEmail} = require('../middleware/mailServices');

async function updateFundraiserForStatus(updatedFundraiser) {
    try {
        const putFundraiser=model.updateFundraiserForStatus(updatedFundraiser);
        if(putFundraiser)
        {
            await sendFundraiserEmail(updatedFundraiser.email,updatedFundraiser.status);
        }
        return putFundraiser;
    } catch (err) {
        throw err;
    }
}
async function updateFundraiser(updatedFundraiser) {
    try {
        return model.updatedFundraiser(updatedFundraiser);
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
async function postFundraiser(userId,bonus,debt,peopleFundraised) {
    try {
        return model.postFundraiser(userId,bonus,debt,peopleFundraised);
    } catch (err) {
        throw err;
    }
}
async function getFundraisers() {
    try {
        return model.getFundraisers();
    } catch (err) {
        throw err;
    }
}
module.exports = {updateFundraiser,getFundraiser,getFundraiserChartData,postFundraiser,getFundraisers,updateFundraiserForStatus}
