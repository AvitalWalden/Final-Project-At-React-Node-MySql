const model = require('../models/imagesModel');

async function updateImage(image,gift_id) {
    try {
        return model.updateImage(image,gift_id);
    } catch (err) {
        throw err;
    }
}


module.exports = {updateImage}