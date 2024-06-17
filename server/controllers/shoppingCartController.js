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


module.exports = {getShoppingCart,postShoppingCart}
