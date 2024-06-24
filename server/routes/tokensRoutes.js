const express = require('express');
const cors = require('cors');
const router = express.Router();
const { getTokenAndUserByToken } = require('../controllers/tokensController');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Configure CORS
router.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

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
