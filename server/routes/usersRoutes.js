const express = require("express");
const cors = require('cors');
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/role_list');
const config = require('../config/config')
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { createUser, getUser, updateUser, getUserForSignup, createNewUser, createUserLogInWithGoogle } = require('../controllers/usersController');
const { postFundraiser } = require('../controllers/fundraisersController')
router.use(cors());
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));



router.post("/", async (req, res) => {
    try {
        let response;

        if (!req.body.password) {
            response = await createUserLogInWithGoogle(req.body.username, req.body.role, req.body.email)
        }
        else {
            response = await createUser(req.body.username, req.body.password, req.body.role);
        }
        if (req.body.role == 'fundraiser') {
            await postFundraiser(response.user.insertId, 0, 0, 0)
        }
        const user = await getUserForSignup(response.user.insertId);

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

router.put("/:id", verifyJWT, verifyRoles([ROLES_LIST.admin, ROLES_LIST.fundraiser, ROLES_LIST.user]), async (req, res) => {
    try {
        console.log("userAfterChange");

        const id = req.params.id;
        const resultUser = await getUser(id);
        console.log("resultUser");
        console.log(resultUser);

        const addressID = resultUser.address_id;
        console.log(req.body.username);
        await updateUser(id, req.body.name, req.body.username, req.body.email, req.body.city, req.body.street, req.body.zipcode, req.body.phone, addressID);
        const userAfterChange = await getUser(id);

        delete userAfterChange.address_id;
        console.log(userAfterChange);
        res.send(userAfterChange);
    } catch (err) {

        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

// router.get("/:email", async (req, res) => {
//     try {
//         console.log("f");

//         const email = req.params.email;
//         const user = await getUserByEmail(email);

//         res.send(user);
//     } catch (err) {
//         console.error('Error fetching user:', err.message);
//         const error = {
//             message: err.message
//         }
//         res.status(500).send(error);
//     }
// });

router.get("/:user_id", verifyJWT, async (req, res) => {
    try {
        console.log("fffffffffff");
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

router.post("/newUser", async (req, res) => {
    try {
        const { name, username, email, phone, city, street, zipcode } = req.body;
        const result = await createNewUser(name, username, email, phone, city, street, zipcode);

        if (result.affectedRows > 0) {
            const newUser = await getUserForSignup(result.insertId);
            res.status(201).send(newUser);
        } else {
            res.status(400).send({ message: 'Failed to create user' });
        }

    } catch (err) {
        console.error('Error creating user:', err.message);
       
        res.status(500).send({ message: err.message });
    }
});

module.exports = router