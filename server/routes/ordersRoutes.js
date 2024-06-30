const express = require("express");
const config = require('../config/config')
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const { getOrder, getOrderByGiftID, createOrder,getOrderByOrderId,getOrders,getOrderAndUserByOrderId } = require('../controllers/orderController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/role_list');
const cookieParser = require('cookie-parser');
const verifyJWT = require("../middleware/verifyJWT");
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));

router.get("/",verifyJWT,verifyRoles(ROLES_LIST.admin), async (req, res) => {
    try {
        const orders = await getOrders();
        res.send(orders);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.get("/user_id/:user_id",verifyJWT,verifyRoles([ROLES_LIST.admin,ROLES_LIST.fundraiser, ROLES_LIST.user]), async (req, res) => {
    try {
        let order;
        const user_id = req.params.user_id;
        order = await getOrder(user_id);
        res.send(order);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.get("/gift_id/:gift_id",verifyJWT,verifyRoles(ROLES_LIST.admin), async (req, res) => {
    try {
        let order;
        const gift_id = req.params.gift_id;
        order = await getOrderByGiftID(gift_id);
        res.send(order);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});
router.get("/order_id/:order_id",verifyJWT,verifyRoles(ROLES_LIST.admin), async (req, res) => {
    try {
        let order;
        const order_id = req.params.order_id;
        order = await getOrderAndUserByOrderId(order_id);
        res.send(order);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});
router.post("/", async (req, res) => {
    try {
        const response = await createOrder(req.body.user_id, req.body.order_date,req.body.order);
        const newOrder = await getOrderByOrderId(response.orderId);
        res.send(newOrder);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

module.exports = router;
