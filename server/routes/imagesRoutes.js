const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cors = require('cors');
router.use(cors());

const { updateImage } = require('../controllers/imagesController');


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



router.put('/:gift_id', upload.single('image'), async (req, res) => {
    try {
        const image = req.file.filename;
        const gift_id = req.params.gift_id;

        console.log(gift_id);
        if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            return res.send({ msg: 'Only image files (jpg, jpeg, png) are allowed!' });
        }
        const imageAfterUpdate = await updateImage(image ,gift_id);
        res.send(imageAfterUpdate);
    } catch (err) {
        const error = {
            message: err.message
        };
        res.status(500).send(error);
    }
});

module.exports = router;