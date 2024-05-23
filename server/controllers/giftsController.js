 const model = require('../models/giftsModel');

// async function createComment(post_id, name, email, body) {
//     try {
//         return model.createComment(post_id, name, email, body);
//     } catch (err) {
//         throw err;
//     }
// }

async function getGifts() {
    try {
        return model.getGifts();
    } catch (err) {
        throw err;
    }

}

// async function getComment(id) {
//     try {
//         return model.getComment(id);
//     } catch (err) {
//         throw err;
//     }
// }

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
 module.exports = { getGifts}