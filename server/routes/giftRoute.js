const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const { getGifts ,getGift ,createGift} = require('../controllers/giftsController');


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

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const gift = await getGift(id);
        res.send(gift);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.post("/", async (req, res) => {
    try {
        const response = await createGift(req.body.name, req.body.price, req.body.image_url);
        res.send(await getGift(response.insertId));
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});



module.exports = router