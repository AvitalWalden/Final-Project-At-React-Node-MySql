const express = require("express");
const config = require('../config/config')
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/role_list');
const cookieParser = require('cookie-parser');
const verifyJWT = require("../middleware/verifyJWT");
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
const {getPackages } = require('../controllers/packagesController');

router.get("/", async (req, res) => {
    try {
        const packages = await getPackages();
        res.send(packages);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

module.exports = router;
