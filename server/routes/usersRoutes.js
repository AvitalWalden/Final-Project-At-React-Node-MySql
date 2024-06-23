const express = require("express");
const cors = require('cors');
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/role_list');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { createUser, getUser, updateUser, getUserForSignup } = require('../controllers/usersController');
router.use(cors());
const { getTokenAndUserByToken } = require('../controllers/tokensController');
const { handleRefreshToken } = require('../controllers/refreshTokenController');




router.get("/:refreshToken", async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt_refreshToken) {
            const error = {
                message: "ERROR, you need log in",
                status: 401
            }
            return res.status(401).send(error);
        }
        const refreshToken = req.params.refreshToken;
        const user = await getTokenAndUserByToken(refreshToken);
        res.send(user);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.post("/", async (req, res) => {
    try {
        const response = await createUser(req.body.username, req.body.password);
        const { user, accessToken, refreshToken } = await getUserForSignup(response.insertId);
        console.log("user" + user);
        res.cookie('jwt_refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 20 * 60 * 60 * 1000 });
        res.cookie('jwt_accessToken', accessToken, { httpOnly: true, maxAge: 30 * 1000 });
        res.send(user);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const resultUser = await getUser(id);
        const addressID = resultUser.address_id;
        await updateUser(id, req.body.name, req.body.username, req.body.email, req.body.city, req.body.street, req.body.zipcode, req.body.phone, req.body.Bonus, req.body.role, addressID);
        const userAfterChange = await getUser(id);
        delete userAfterChange.address_id;
        res.send(userAfterChange);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await getUser(id);
        res.send(user);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

module.exports = router