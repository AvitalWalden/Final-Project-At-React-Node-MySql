const express = require("express");
const cors = require('cors');
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());
const { handleRefreshToken} = require('../controllers/tokensController');

// router.get("/:refreshToken", async (req, res) => {
//     try {
//         const refreshToken = req.params.refreshToken;
//         const user = await getTokenAndUserByToken(refreshToken);
//         res.send(user);
//     } catch (err) {
//         const error = {
//             message: err.message
//         }
//         res.status(500).send(error);
//     }
// })

router.get('/', async (req, res) => {
    try {

        const accessToken = req.cookies.jwt_accessToken;
        const refreshToken = req.cookies.jwt_refreshToken;
        // בדוק את העוגיות ואמת אותן
        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized you need login' });
        }

        // נניח שפונקציה verifyToken בודקת את התוקף של accessToken
        if (!verifyToken(accessToken)) {
            // נניח שפונקציה refreshAccessToken מחדשת את ה-accessToken
            const newAccessToken = handleRefreshToken(refreshToken);
            if (!newAccessToken.token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            res.cookie('jwt_accessToken', newAccessToken.accessToken, { httpOnly: true, maxAge: 30 * 1000 });
        }
        const user = await getTokenAndUserByToken(refreshToken);
        res.send(user);
    } catch (err) {
        const error = {
            message: err.message
        }
        res.status(500).send(error);
    }
});

module.exports = router
