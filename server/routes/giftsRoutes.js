const express = require("express");
const config = require('../config/config')
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const verifyRoles = require('../middleware/verifyRoles');
const { getGifts, getAllGiftsOrderQuantity, getGift, createGift, deleteGift, getGiftsWithUserDetails, updateWinnerOfGift } = require('../controllers/giftsController');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
const verifyJWT = require('../middleware/verifyJWT')

router.get("/allGiftsOrderQuantity", async (req, res) => {
    try {
        const allGiftsOrderQuantity = await getAllGiftsOrderQuantity();
        res.send(allGiftsOrderQuantity);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

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

router.get("/winners", async (req, res) => {
    try {
        res.send(await getGiftsWithUserDetails());
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
})


router.get("/:id",verifyJWT, verifyRoles(["admin"]), async (req, res) => {
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


router.post("/", verifyJWT, verifyRoles(["admin"]), async (req, res) => {
    try {
        if (!req.body.name || !req.body.price ) {
            const error = {
                message: "Fill in the data"
            }
            res.status(400).send(error);
        }
        else {
            const response = await createGift(req.body.name, req.body.price, req.body.image_url);
            res.send(await getGift(response.insertId));
        }
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.delete("/:gift_id", verifyJWT, verifyRoles(["admin"]), async (req, res) => {
    try {
        const id = req.params.gift_id;
        await deleteGift(id);
        res.send();
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.put("/:id", verifyJWT, verifyRoles(["admin"]), async (req, res) => {
    try {
        if (!req.body.name || !req.body.price) {
            const error = {
                message: "Fill in the data"
            }
            res.status(400).send(error);
        }
        else {
            const id = req.params.id;
            const giftAfterUpdate = await updateWinnerOfGift(id, req.body.winner_id, req.body.name, req.body.price, req.body.image_url);
            res.send(giftAfterUpdate);
        }
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }

});


module.exports = router