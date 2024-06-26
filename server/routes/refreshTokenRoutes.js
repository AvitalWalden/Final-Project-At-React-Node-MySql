const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const cors = require('cors');
const config = require('../config/config')
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));


router.get('/', refreshTokenController.handleRefreshToken);


module.exports = router;


// router.get('/', async (req, res) => {
//     try {
//         const cookies = req.cookies;
//         const accessToken = await refreshTokenController.handleRefreshToken(cookies);
//         console.log(accessToken);
//         res.cookie('jwt_accessToken', accessToken, { httpOnly: true, maxAge: 30 * 1000 });
//         res.status(200).send({ accessToken }); 
//     } catch (err) {
//         const error = {
//             message: err.message
//         }
//         res.status(500).send(error);
//     }
// });