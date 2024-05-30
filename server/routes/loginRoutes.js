const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { logIn, getUser } = require('../controllers/usersController');
router.use(cors());

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const userName = req.body.username;
        const password = req.body.password;
        let user = await logIn(userName, password);
        userLogIn = await getUser(user.user_id);
        delete userLogIn.address_id;
        res.send(userLogIn);
    }
    catch (err) {
        const error = {
            message: err.message
        }
        res.status(401).send(error);
    }

});

module.exports = router;