const express = require("express");
const cors = require('cors');
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/role_list');
const config = require('../config/config')
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { createUser, getUser, updateUser, getUserForSignup } = require('../controllers/usersController');
router.use(cors());
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));





router.post("/",async (req, res) => {
    try {

        const response = await createUser(req.body.username, req.body.password,req.body.role);
        const  user = await getUserForSignup(response.user.insertId);
        res.cookie('jwt_refreshToken', response.refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 20 * 60 * 60 * 1000 });
        res.cookie('jwt_accessToken', response.accessToken, { httpOnly: true, maxAge: 30 * 1000 });
        res.send(user);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.put("/:id",verifyJWT, async (req, res) => {
    try {
        const id = req.params.id;
        const resultUser = await getUser(id);
        const addressID = resultUser.address_id;
        await updateUser(id, req.body.name, req.body.username, req.body.email, req.body.city, req.body.street, req.body.zipcode, req.body.phone, req.body.Bonus, addressID);
        const userAfterChange = await getUser(id);
        delete userAfterChange.address_id;
        console.log(userAfterChange);
        res.send(userAfterChange);
    } catch (err) {
        console.log("fffffffffffffffffff");

        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.get("/:user_id",verifyJWT, async (req, res) => {
    try {
        const id = req.params.user_id;
        const user = await getUser(id);

        res.send(user);
    } catch (err) {
        console.error('Error fetching user:', err.message); 
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});
module.exports = router