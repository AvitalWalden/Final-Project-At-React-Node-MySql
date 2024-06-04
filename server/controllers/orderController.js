const model = require('../models/orderModel');

async function getOrder(id) {
    try {
        return model.getOrder(id);
    } catch (err) {
        throw err;
    }
}

module.exports = {getOrder}
