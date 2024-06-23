const express = require("express");
const config = require('../config/config')
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/role_list');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());
const cookieParser = require('cookie-parser');
router.use(cookieParser());
router.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));



const { updateImage } = require('../controllers/imagesController');
const { getGift } = require('../controllers/giftsController');


// Ensure the directory exists
const uploadDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.put('/:gift_id', verifyRoles(ROLES_LIST.Admin), upload.single('image'), async (req, res) => {
    try {
        const image = req.file.filename;
        const gift_id = req.params.gift_id;

        if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            return res.status(400).send({ msg: 'Only image files (jpg, jpeg, png) are allowed!' });
        }
        await updateImage(image, gift_id);
        const giftAfterUpdate = await getGift(gift_id);
        res.send(giftAfterUpdate);
    } catch (err) {
        const error = {
            message: err.message
        };
        res.status(500).send(error);
    }
});

module.exports = router;
