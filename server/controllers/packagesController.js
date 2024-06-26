const model = require('../models/packagesModel');

async function getPackages() {
    try {
        return model.getPackages();
    } catch (err) {
        throw err;
    }
}
module.exports = {getPackages}
