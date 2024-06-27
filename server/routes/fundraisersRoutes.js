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
const {updateFundraisers } = require('../controllers/fundraisersController');

router.put("/:user_id", async (req, res) => {
    const userId = req.params.user_id;
    const updatedFundraiser = req.body; 
    updatedFundraiser.user_id = userId;

    try {
        const result = await updateFundraisers(updatedFundraiser);
        res.send(result);
    } catch (error) {
        console.error('Error updating fundraiser:', error.message);
        res.status(500).json({ error: 'Failed to update fundraiser' });
    }
});

module.exports = router;
