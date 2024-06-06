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
        const giftsWithImages = allGifts.map(gift => {
            return {
                ...gift,
                image_url: `${gift.image_url}.jpg`
            };
        });
        return giftsWithImages;
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


async function deleteGift(id) {
    try {
        return model.deleteGift(id);
    } catch (err) {
        throw err;
    }
}

module.exports = { getGifts, createGift, getGift,deleteGift }