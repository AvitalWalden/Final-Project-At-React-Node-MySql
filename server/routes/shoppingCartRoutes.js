const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const { getShoppingCart,postShoppingCart} = require('../controllers/shoppingCartController');



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
router.post("/", async (req, res) => {  

    try {
        let shoppingCart;
        const { userId, order } = req.body;
        console.log(userId, order )
        shoppingCart = await postShoppingCart(userId, order);
        res.send(shoppingCart);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

  
module.exports = router;
