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
async function putShoppingCart(userId,giftId,quantity,isChecked) {

    try {
        return model.putShoppingCart(userId,giftId,quantity,isChecked);
    } catch (err) {
        throw err;
    }
}

module.exports = {getShoppingCart,postShoppingCart,deleteShoppingCart,putShoppingCart}
