require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    let cookieToken = req.cookies.jwt_accessToken; // Assuming the access token is stored in cookies
    if (!cookieToken) {
         console.log('JWT token not found in cookies');
        return res.sendStatus(401);
    }
    try {
        jwt.verify(
            cookieToken, // Use the token from cookies here
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                     console.log('JWT verification error:', err);
                    throw err;
                }
                else {
                    req.user = decoded.UserInfo.username; // Assuming your payload structure is "UserInfo"
                    req.role = decoded.UserInfo.role;
                    console.log(req.role);
                    next();
                }

            }
        );
    } catch {
         console.log('JWT token not found in cookies');
        return res.sendStatus(401);
    }
}

module.exports = verifyJWT;
