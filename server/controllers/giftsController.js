const model = require('../models/giftsModel');
const { getUser} = require('../controllers/usersController');
const { sendWinnerEmail} = require('../middleware/mailServices');

async function createGift(name, price, image_url) {
    try {
        return model.createGift(name, price, image_url);
    } catch (err) {
        throw err;
    }
}

async function getGifts() {
    try {
        const allGifts = await model.getGifts();
        return allGifts;
    } catch (err) {
        throw err;
    }
}

async function getGift(id) {
    try {
        return model.getGift(id);
    } catch (err) {
        throw err;
    }
}

async function getGiftsWithUserDetails() {
    try {
        return model.getGiftsWithUserDetails();
    } catch (err) {
        throw err;
    }
}

async function deleteGift(id) {
    try {
        return model.deleteGift(id);
    } catch (err) {
        throw err;
    }
}

async function updateWinnerOfGift(id,winner_id,name,price, image_url) {
    try {
        const afterUpdate = await model.updateWinnerOfGift(id,winner_id,name,price, image_url);
        if(afterUpdate && winner_id){
            console.log("jhgfffffffffffffffffffffffffffffffffff")
            const winnerEmail = await getUser(winner_id);
            await sendWinnerEmail(winnerEmail, name);
        }
    } catch (err) {
        throw err;
    }
}

module.exports = { getGifts, createGift, getGift, deleteGift, getGiftsWithUserDetails,updateWinnerOfGift }