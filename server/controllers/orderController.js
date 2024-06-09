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

async function getOrderByOrderId(order_id) {
    try {
        return model.getOrderByOrderId(order_id);
    } catch (err) {
        throw err;
    }
}
async function createOrder(user_id, order_date,order) {
    try {
        const orderModel = await model.createOrder(user_id, order_date, order);
        return orderModel;
    } catch (err) {
            throw err;
    }
}
module.exports = {getOrder,getOrderByGiftID,createOrder,getOrderByOrderId}
