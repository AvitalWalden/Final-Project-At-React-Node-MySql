const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const { getOrder, getOrderByGiftID } = require('../controllers/orderController');


router.get("/user_id/:user_id", async (req, res) => {
    try {
        let order;
        const user_id = req.params.user_id;
        console.log(user_id);
        console.log("hgfdsa");
        order = await getOrder(user_id);
        res.send(order);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.get("/gift_id/:gift_id", async (req, res) => {
    try {
        console.log("gggg");
        let order;
        const gift_id = req.params.gift_id;
        console.log(gift_id);
        order = await getOrderByGiftID(gift_id);
        res.send(order);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

module.exports = router;
