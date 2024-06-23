const express = require('express');
const router = express.Router();
const config = require('../config/config')
const cookieParser = require('cookie-parser');
const cors = require('cors');
router.use(cors());
const logoutController = require('../controllers/logoutController');
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));

router.get('/', logoutController.handleLogout);

module.exports = router;