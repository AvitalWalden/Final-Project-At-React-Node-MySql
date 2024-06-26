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
    if (!cookies.jwt_refreshToken) {
      return;
    }
    const user = await getTokenAndUserByToken(cookies.jwt_refreshToken);
    res.send(user);
  } catch (err) {
    const error = {
      message: err.message
    };
    res.status(500).send(error);
  }
});

module.exports = router;
