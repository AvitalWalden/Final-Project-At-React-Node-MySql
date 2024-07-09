const express = require("express");
const cors = require('cors');
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');
const config = require('../config/config')
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { createUser, getUser, updateUser, createNewUser, createUserLogInWithGoogle } = require('../controllers/usersController');
const { postFundraiser } = require('../controllers/fundraisersController')
router.use(cors());
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));

router.post("/", async (req, res) => {
    try {
        let response;
        if (!req.body.username || !req.body.role) {
            const error = {
                message: "Fill in the data"
            }
            res.status(400).send(error);
        }
        else {
            if (!req.body.password) {
                response = await createUserLogInWithGoogle(req.body.username, req.body.role, req.body.email)
            }
            else {
                response = await createUser(req.body.username, req.body.password, req.body.role);
            }
            if (req.body.role == 'fundraiser') {
                await postFundraiser(response.user.insertId, 0, 0, 0)
            }
            const user = await getUser(response.user.insertId);
            res.cookie('jwt_refreshToken', response.refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 20 * 60 * 60 * 1000 });
            res.cookie('jwt_accessToken', response.accessToken, { httpOnly: true, maxAge: 5 * 60 * 1000 });
            res.send(user);
        }
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.put("/:id", verifyJWT, verifyRoles(["admin", "fundraiser", "user"]), async (req, res) => {
    try {
        if (!ValidateEmail(req.body.email) || !req.body.name || !req.body.username || !req.body.city || !req.body.street || !req.body.zipcode || !req.body.phone) {
            const error = {
                message: "Fill in the data"
            }
            res.status(400).send(error);
        }
        else {
            const id = req.params.id;
            const resultUser = await getUser(id);
            const addressID = resultUser.address_id;
            await updateUser(id, req.body.name, req.body.username, req.body.email, req.body.city, req.body.street, req.body.zipcode, req.body.phone, addressID);
            const userAfterChange = await getUser(id);
            delete userAfterChange.address_id;
            res.send(userAfterChange);
        }
    } catch (err) {

        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});


router.get("/:user_id", verifyJWT, async (req, res) => {
    try {
        const id = req.params.user_id;
        const user = await getUser(id);
        res.send(user);
    } catch (err) {
         console.log('Error fetching user:', err.message);
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

router.post("/newUser",verifyJWT,verifyRoles(["admin",'fundraiser']) ,async (req, res) => {
    try {
        const { name, username, email, phone, city, street, zipcode } = req.body;
        if (!ValidateEmail(req.body.email) || !req.body.name || !req.body.username || !req.body.city || !req.body.street || !req.body.zipcode || !req.body.phone || !req.body.email) {
            const error = {
                message: "Fill in the data"
            }
            res.status(400).send(error);
        }
        else {
            const result = await createNewUser(name, username, email, phone, city, street, zipcode);

            // if (result.affectedRows > 0) {
                const newUser = await getUser(result.insertId);
                res.status(201).send(newUser);
            // } else {
            //     res.status(400).send({ message: 'Failed to create user' });
            // }
        }
    }  catch (err) {

        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

function ValidateEmail(mailAdress) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    console.log(mailAdress);
    return mailAdress.match(mailformat);
}

module.exports = router