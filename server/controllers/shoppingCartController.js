const model = require('../models/shoppingCartModel');

async function getShoppingCart(id) {
    try {
        return model.getShoppingCart(id);
    } catch (err) {
        throw err;
    }
}
async function postShoppingCart(userId, temporaryCart) {
    try {
        return model.postShoppingCart(userId, temporaryCart);
    } catch (err) {
        throw err;
    }
}

async function deleteShoppingCart(userId,giftIds) {
    try {
        return model.deleteShoppingCart(userId,giftIds);
    } catch (err) {
        throw err;
    }
}

async function putShoppingCart(userId,giftId,newQuantity) {

    try {
        return model.putShoppingCart(userId,giftId,newQuantity);
    } catch (err) {
        throw err;
    }
}

module.exports = {getShoppingCart,postShoppingCart,deleteShoppingCart,putShoppingCart}
