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
                image_url: `.../server/images/${gift.image_url}`
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

// async function deleteComment(id) {
//     try {
//         return model.deleteComment(id);
//     } catch (err) {
//         throw err;
//     }
// }
// async function updateComment(id, name, body) {
//     try {
//         return model.updateComment(id, name, body);
//     } catch (err) {
//         throw err;
//     }
// }
module.exports = { getGifts, createGift, getGift }