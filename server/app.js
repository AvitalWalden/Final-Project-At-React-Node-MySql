const config = require('./config/config')
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));

const port = 3000;

const logger = (req, res, next)=>{
    const url = req.url;
    const date = new Date();
    const msg = `Date: ${date}, Url:${url} \n`;
    fs.appendFile(path.join(__dirname, 'log.txt'), msg, ()=>{
        console.log('success!!');
        next();
    });

}
app.use(logger);
const loginRoutes = require("./routes/loginRoutes")
app.use("/login", loginRoutes);
const giftsRoutes = require("./routes/giftsRoutes")
app.use("/gifts", giftsRoutes);
const signupRoutes = require("./routes/usersRoutes")
app.use("/signup", signupRoutes);
const refreshRoutes = require("./routes/refreshTokenRoutes")
app.use("/refresh", refreshRoutes);
const logoutRoutes = require("./routes/logoutRoutes")
app.use("/logout", logoutRoutes);
const imageRoutes = require("./routes/imagesRoutes")
app.use("/upload", imageRoutes)
const usersRoutes = require("./routes/usersRoutes")
app.use("/users", usersRoutes);
const ordersRoutes = require("./routes/ordersRoutes")
app.use("/orders", ordersRoutes);
const shoppingCartRoutes = require("./routes/shoppingCartRoutes")
app.use("/shoppingCart", shoppingCartRoutes);
const tokensRoutes = require("./routes/tokensRoutes")
app.use("/refreshment", tokensRoutes);
const packagesRoutes = require("./routes/packagesRoutes")
app.use("/packages", packagesRoutes);
const fundraisersRoutes = require("./routes/fundraisersRoutes")
app.use("/fundraisers", fundraisersRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


// process.on('unhandledRejection', (reason, promise) => {
//     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//     // Application specific logging, throwing an error, or other logic here
// });