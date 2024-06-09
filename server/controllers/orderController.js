const model = require('../models/orderModel');

async function getOrder(id) {
    try {
        return model.getOrder(id);
    } catch (err) {
        throw err;
    }
}

async function getOrderByGiftID(gift_id) {
    try {
        return model.getOrderByGiftID(gift_id);
    } catch (err) {
        throw err;
    }
}

module.exports = {getOrder,getOrderByGiftID}
