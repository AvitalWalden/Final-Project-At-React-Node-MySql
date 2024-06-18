const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { logIn, getUser } = require('../controllers/usersController');
router.use(cors());

// router.post("/", async (req, res) => {
//     try {
//         const userName = req.body.username;
//         const password = req.body.password;
//         let user = await logIn(userName, password);
//         userLogIn = await getUser(user.user_id);
//         delete userLogIn.address_id;
//         res.send(userLogIn);
//     }
//     catch (err) {
//         const error = {
//             message: err.message
//         }
//         res.status(401).send(error);
//     }

// });

router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        const { user, accessToken, refreshToken } = await logIn(username, password);
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        const userLogIn = await getUser(user.user_id);
        delete userLogIn.address_id;

        res.json({
            accessToken,
            user: userLogIn
        });
    } catch (err) {
        const error = {
            message: err.message
        };
        res.status(401).send(error);
    }
});

module.exports = router;