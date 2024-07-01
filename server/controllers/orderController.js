const model = require('../models/orderModel');
const { sendOrderEmail} = require('../middleware/mailServices');

async function getOrder(id) {
    try {
        return model.getOrder(id);
    } catch (err) {
        throw err;
    }
}
async function getOrders() {
    try {
        return model.getOrders();
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
async function createOrder(user_id, order_date,order,totalPrice,email) {
    try {
        const orderModel = await model.createOrder(user_id, order_date, order);
        if(orderModel)
            {
               await sendOrderEmail(email,order,totalPrice);
            }
        return orderModel;
    } catch (err) {
            throw err;
    }
}
async function getOrderAndUserByOrderId(order_id) {
    try {
        const orderModel = await model.getOrderAndUserByOrderId(order_id);
        return orderModel;
    } catch (err) {
            throw err;
    }
}
module.exports = {getOrder,getOrderByGiftID,createOrder,getOrderByOrderId,getOrders,getOrderAndUserByOrderId}
