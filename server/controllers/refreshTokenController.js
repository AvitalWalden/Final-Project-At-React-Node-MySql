require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getTokensAndUsers } = require('../models/tokensModel.js');


async function handleRefreshToken  (cookies){
    
    if (!cookies?.jwt_refreshToken) {
        const error = {
            message: "ERROR, you need log in",
            status: 401
        }
        return res.status(401).send(error);
    }
    let accessToken;
    const refreshToken = cookies.jwt_refreshToken;
    const users = await getTokensAndUsers();    
    const foundUser = users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    const role = foundUser.role

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                console.log("ךbךך",decoded,"err",err)
                return res.sendStatus(403);
            }
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
    return accessToken;
    
}


module.exports = { handleRefreshToken }