const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const { getGifts} = require('../controllers/giftsController');


router.get("/", async (req, res) => {
    try {
        res.send(await getGifts());
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
})

module.exports = router