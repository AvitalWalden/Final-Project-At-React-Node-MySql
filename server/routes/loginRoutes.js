const config = require('../config/config')
const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { logIn, getUser ,getUserLogInWithGoogle} = require('../controllers/usersController');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));

router.post("/", async (req, res) => {
    try {
        let user, accessToken, refreshToken;
        
        if (!req.body.password) {
            ({ user, accessToken, refreshToken } = await getUserLogInWithGoogle(req.body.email, req.body.role));
        } else {
            const { username, password } = req.body;
            ({ user, accessToken, refreshToken } = await logIn(username, password));
        }

        res.cookie('jwt_refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 20 * 60 * 60 * 1000 });
        res.cookie('jwt_accessToken', accessToken, { httpOnly: true, secure: true, maxAge: 30 * 1000 });

        const userLogIn = await getUser(user.user_id);
        delete userLogIn.address_id;

        res.send(userLogIn);
    } catch (err) {
        const error = {
            message: err.message
        };
        res.status(401).send(error);
    }
});

module.exports = router;