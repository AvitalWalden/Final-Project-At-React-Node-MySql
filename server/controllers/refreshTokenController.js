require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getTokenAndUser} = require('../models/tokensModel.js');


const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt_refreshToken){
        const error = {
            message: "ERROR, you need log in"
        }
        return res.status(401).send(error);
    }   
    const refreshToken = cookies.jwt_refreshToken;
    const users = getTokenAndUser();
    const foundUser = users.find(person => person.refreshToken === refreshToken);

    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const role = Object.values(foundUser.role)
            const accessToken = jwt.sign(
                {  "UserInf": {
                    "username": decoded.username,
                    "roles": role
                } },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    );
}


module.exports = {handleRefreshToken}