const express = require("express");
const config = require('../config/config')
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const verifyRoles = require('../middleware/verifyRoles');
const cookieParser = require('cookie-parser');
const verifyJWT = require("../middleware/verifyJWT");
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
const { updateFundraiser, getFundraiser, getFundraiserChartData, getFundraisers, updateFundraiserForStatus } = require('../controllers/fundraisersController');

router.get("/", verifyJWT, verifyRoles(["admin"]), async (req, res) => {
    try {
        const result = await getFundraisers();
        res.send(result);
    } catch (error) {
        console.log('Error fetching fundraisers :', error.message);
        res.status(500).json({ error: 'Failed to fetching fundraisers ' });
    }
});

router.get("/fundraiserChartData", verifyJWT, verifyRoles(["admin"]), async (req, res) => {
    try {
        const result = await getFundraiserChartData();
        res.send(result);
    } catch (error) {
        console.log('Error fetching fundraisers chart data:', error.message);
        res.status(500).json({ error: 'Failed to fetching fundraisers chart data' });
    }
});

router.get("/:fundraiser_id", verifyJWT, verifyRoles(["admin","fundraiser"]), async (req, res) => {
    try {
        const fundraiserId = req.params.fundraiser_id;
        const fundraiser = await getFundraiser(fundraiserId);
        res.send(fundraiser);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.put("/:user_id", verifyJWT, verifyRoles(["admin","fundraiser"]), async (req, res) => {
    const userId = req.params.user_id;
    const updatedFundraiser = req.body;
    updatedFundraiser.user_id = userId;
    try {
        const result = await updateFundraiser(updatedFundraiser);

        const fundraiser = await getFundraiser(userId);
        res.send(fundraiser);
    } catch (error) {
        console.log('Error updating fundraiser:', error.message);
        res.status(500).json({ error: 'Failed to update fundraiser' });
    }
});

router.put("/status/:user_id",  verifyJWT, verifyRoles(["admin"]), async (req, res) => {
    const userId = req.params.user_id;
    const updatedFundraiser = req.body;
    updatedFundraiser.user_id = userId;
    try {
        const result = await updateFundraiserForStatus(updatedFundraiser);

        const fundraiser = await getFundraiser(userId);
        res.send(fundraiser);
    } catch (error) {
        console.log('Error updating fundraiser:', error.message);
        res.status(500).json({ error: 'Failed to update fundraiser' });
    }
});

module.exports = router;
