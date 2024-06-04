const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;


const loginRoutes=require("./routes/loginRoutes")
app.use("/logIn",loginRoutes);
const giftsRoutes=require("./routes/giftRoute")
app.use("/gifts",giftsRoutes);
const signupRoutes=require("./routes/usersRoutes")
app.use("/signup",signupRoutes);
const usersRoutes=require("./routes/usersRoutes")
app.use("/users",usersRoutes);
const ordersRoutes=require("./routes/ordersRoute")
app.use("/orders",ordersRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
