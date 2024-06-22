require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getTokenAndUser } = require('../models/tokensModel.js');


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log("cookies");
    console.log(cookies);

    if (!cookies?.jwt_refreshToken) {
        const error = {
            message: "ERROR, you need log in",
            status: 401
        }
        return res.status(401).send(error);
    }
    let accessToken;
    const refreshToken = cookies.jwt_refreshToken;
    const users = await getTokenAndUser();
    const foundUser = users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const role = Object.values(foundUser.role)
            accessToken = jwt.sign(
                {
                    "UserInf": {
                        "username": decoded.username,
                        "roles": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
        }
              
    );
    console.log(accessToken);
    res.cookie('jwt_accessToken', accessToken, { httpOnly: true, maxAge: 30 * 1000 });

}


module.exports = { handleRefreshToken }