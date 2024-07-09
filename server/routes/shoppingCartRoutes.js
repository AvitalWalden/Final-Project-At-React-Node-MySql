const express = require("express");
const config = require('../config/config')
const router = express.Router();
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/role_list');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const { getShoppingCart,postShoppingCart,deleteShoppingCart,putShoppingCart} = require('../controllers/shoppingCartController');
const cookieParser = require('cookie-parser');
const verifyJWT = require("../middleware/verifyJWT");
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));


router.get("/:user_id",verifyJWT,verifyRoles(["admin","fundraiser","user"]), async (req, res) => {
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

router.post("/",verifyJWT,verifyRoles(["admin","fundraiser","user"]), async (req, res) => {  
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
router.put("/",verifyJWT,verifyRoles(["admin","fundraiser","user"]), async (req, res) => {  

    try {
        let shoppingCart;
        const { userId, giftId,quantity,isChecked } = req.body;
        console.log("erer",userId,giftId,quantity,isChecked)
        shoppingCart = await putShoppingCart(userId, giftId,quantity,isChecked);
        res.send(shoppingCart);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.delete('/:userId',verifyJWT, verifyRoles(["admin","fundraiser","user"]), async (req, res) => {
    try {
      const userId = req.params.userId;
      const giftIds = req.body.giftIds; 
  
      const shoppingCart = await deleteShoppingCart(userId, giftIds);
      res.send(shoppingCart);
    } catch (err) {
      const error = {
        message: err.message
      };
      res.status(500).send(error);
    }
  });
  

  
module.exports = router;
