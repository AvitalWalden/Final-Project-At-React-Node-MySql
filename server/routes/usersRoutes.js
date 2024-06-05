const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { createUser, getUser, updateUser, getUserForSignup } = require('../controllers/usersController');
router.use(cors());

router.post("/", async (req, res) => {
    try {
        const response = await createUser(req.body.username, req.body.password);
        const newUser = await getUserForSignup(response.insertId);
        res.send(newUser);
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
        await getUser(id);
        console.log(req.body)
        await updateUser(id, req.body.name, req.body.username, req.body.email, req.body.city, req.body.street, req.body.zipcode, req.body.phone, req.body.Bonus, req.body.role);
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