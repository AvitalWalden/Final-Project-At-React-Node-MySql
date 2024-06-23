const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

router.get('/', async (req, res) => {
    try {
        const cookies = req.cookies;
        const accessToken = await refreshTokenController.handleRefreshToken(cookies);
        console.log("lll",accessToken)
        res.cookie('jwt_accessToken', accessToken, { httpOnly: true, maxAge: 30 * 1000 });
        res.status(200).send({ accessToken }); // Optional: send the new accessToken back if needed
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});
module.exports = router;