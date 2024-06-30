require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getTokensAndUsers } = require('../models/tokensModel.js');

async function handleRefreshToken(cookies) {

    if (!cookies?.jwt_refreshToken) {
        console.log("cookies")

        console.log(cookies)
        const error = {
            message: "ERROR, you need log in",
            status: 401
        }
        throw error;
    }
    console.log("cookies")

    let accessToken;
    const refreshToken = cookies.jwt_refreshToken;
    
    console.log(refreshToken)

    const users = await getTokensAndUsers();
    const foundUser = users.find(person => person.refreshToken === refreshToken);
    console.log(foundUser)

    if (!foundUser) {

        const error = {
            message: "ERROR, you need log in",
            status: 401
        }
        throw error;
    }
    const role = foundUser.role
    console.log(role)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                console.log(decoded.username)

                const error = {
                    message: "ERROR, you need log in",
                    status: 401
                }
                throw error;
            }
            accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
        }

    );
    console.log("cookies")
    console.log(accessToken)

    return accessToken;

}


module.exports = { handleRefreshToken }