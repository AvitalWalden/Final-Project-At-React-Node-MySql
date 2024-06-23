const express = require("express");
const config = require('../config/config')
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const { getShoppingCart,postShoppingCart,deleteShoppingCart,putShoppingCart} = require('../controllers/shoppingCartController');
const cookieParser = require('cookie-parser');
const verifyJWT = require("../middleware/verifyJWT");
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));


router.get("/:user_id", async (req, res) => {
    try {
        let shoppingCart;
        const user_id = req.params.user_id;
        shoppingCart = await getShoppingCart(user_id);
        res.send(shoppingCart);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});
router.post("/",verifyJWT, async (req, res) => {  

    try {
        let shoppingCart;
        const { userId, order } = req.body;
        shoppingCart = await postShoppingCart(userId, order);
        res.send(shoppingCart);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});
router.put("/", async (req, res) => {  

    try {
        let shoppingCart;
        const { userId, giftId,newQuantity } = req.body;
        shoppingCart = await putShoppingCart(userId, giftId,newQuantity);
        res.send(shoppingCart);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});
router.delete('/:userId/:giftId', async(req, res) => {
    try {
        let shoppingCart;
        const userId= req.params.userId;
        const giftId= req.params.giftId;

        shoppingCart = await deleteShoppingCart(userId,giftId);
        res.send(shoppingCart);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
  });

  
module.exports = router;
