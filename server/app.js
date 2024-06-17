const express = require('express');
const path = require('path');
const app = express();
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
app.use(express.json( ));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

const port = 3000;
const imageRoutes = require("./routes/imagesRoutes")
app.use("/upload",imageRoutes)
const loginRoutes=require("./routes/loginRoutes")
app.use("/logIn",loginRoutes);
const giftsRoutes=require("./routes/giftsRoutes")
app.use("/gifts",giftsRoutes);
const signupRoutes=require("./routes/usersRoutes")
app.use("/signup",signupRoutes);
const winnerRoutes=require("./routes/usersRoutes")
app.use("/signup",winnerRoutes);
;
// app.use(verifyJWT);
const usersRoutes=require("./routes/usersRoutes")
app.use("/users",usersRoutes);
const ordersRoutes=require("./routes/ordersRoutes")
app.use("/orders",ordersRoutes);
const shoppingCartRoutes=require("./routes/shoppingCartRoutes")
app.use("/shoppingCart",shoppingCartRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
