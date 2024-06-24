require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    let cookieToken = req.cookies.jwt_accessToken; // Assuming the access token is stored in cookies

    if (!cookieToken) {
        console.error('JWT token not found in cookies');
        return res.sendStatus(401);
    }

    jwt.verify(
        cookieToken, // Use the token from cookies here
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.sendStatus(403); // Invalid token
            }
            req.user = decoded.UserInf.username; // Assuming your payload structure is "UserInf"
            req.roles = decoded.UserInf.roles;
            next();
        }
    );
}

module.exports = verifyJWT;
