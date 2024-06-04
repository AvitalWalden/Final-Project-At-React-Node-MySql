const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const { getOrder  } = require('../controllers/orderController');


router.get("/:user_id", async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const order = await getOrder(user_id);
        res.send(order);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

module.exports = router;
