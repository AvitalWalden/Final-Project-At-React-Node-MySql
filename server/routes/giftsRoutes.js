const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const ROLES_LIST = require('../config/role_list');
const verifyRoles = require('../middleware/verifyRoles');
const { getGifts ,getGift ,createGift,deleteGift,getGiftsWithUserDetails,updateWinnerOfGift} = require('../controllers/giftsController');


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

router.get("/winners",verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    try {
        res.send(await getGiftsWithUserDetails());
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
})


router.get("/:id",verifyRoles(ROLES_LIST.Admin), async (req, res) => {
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

router.post("/",verifyRoles(ROLES_LIST.Admin), async (req, res) => {
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

router.delete("/:gift_id",verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    try{
        const id = req.params.gift_id;
        await deleteGift(id);
        res.send();
    }catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.put("/:id",verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    try {
        const id = req.params.id;
        const giftAfterUpdate = await updateWinnerOfGift(id,req.body.winner_id,req.body.name,req.body.price, req.body.image_url);
        res.send(giftAfterUpdate);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }

});


module.exports = router