const model = require('../models/tokensModel');

async function getTokenAndUserByToken(token) {
    try {
        return model.getTokenAndUserByToken(token);
    } catch (err) {
        throw err;
    }
}
module.exports = {getTokenAndUserByToken  }