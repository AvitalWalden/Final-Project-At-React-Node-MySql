const config = require('./config/config')
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
app.use(express.json( ));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));


const port = 3000;

const loginRoutes=require("./routes/loginRoutes")
app.use("/login",loginRoutes);
const giftsRoutes=require("./routes/giftsRoutes")
app.use("/gifts",giftsRoutes);
const signupRoutes=require("./routes/usersRoutes")
app.use("/signup",signupRoutes);
const refreshRoutes=require("./routes/refreshTokenRoutes")
app.use("/refresh",refreshRoutes);
const logoutRoutes=require("./routes/logoutRoutes")
app.use("/logout",logoutRoutes);
// const logoutRoutes=require("./routes/logoutRoutes")
// app.use("/logout",logoutRoutes);

app.use(verifyJWT);
// const winnerRoutes=require("./routes/giftsRoutes")
// app.use("/winners",winnerRoutes);
const imageRoutes = require("./routes/imagesRoutes")
app.use("/upload",imageRoutes)
const usersRoutes=require("./routes/usersRoutes")
app.use("/users",usersRoutes);
const ordersRoutes=require("./routes/ordersRoutes")
app.use("/orders",ordersRoutes);
const shoppingCartRoutes=require("./routes/shoppingCartRoutes")
app.use("/shoppingCart",shoppingCartRoutes);
const tokensRoutes=require("./routes/tokensRoutes")
app.use("/refreshment",tokensRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
