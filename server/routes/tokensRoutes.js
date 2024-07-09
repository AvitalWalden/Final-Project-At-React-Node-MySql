const config = require('../config/config')
const express = require('express');
const cors = require('cors');
const router = express.Router();
const { getTokenAndUserByToken } = require('../controllers/tokensController');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));

router.get("/", async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies.jwt_refreshToken) {
      return res.status(401).send({ message: 'No refresh token found' });
        }
    const user = await getTokenAndUserByToken(cookies.jwt_refreshToken);
    console.log(user);

    if (!user) {
      return res.status(401).send({ message: 'Log in first' });
    }
    res.send(user);
  } catch (err) {
    const error = {
      message: err.message
    };
    res.status(500).send(error);
  }
});


module.exports = router;
