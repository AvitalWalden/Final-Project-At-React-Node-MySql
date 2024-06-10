const model = require('../models/giftsModel');


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
        // const giftsWithImages = allGifts.map(gift => {
        //     return {
        //         ...gift,
        //         image_url: `${gift.image_url}.jpg`
        //     };
        // });
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
        console.log("22222222222222")

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
        return model.updateWinnerOfGift(id,winner_id,name,price, image_url);
    } catch (err) {
        throw err;
    }
}
module.exports = { getGifts, createGift, getGift, deleteGift, getGiftsWithUserDetails,updateWinnerOfGift }