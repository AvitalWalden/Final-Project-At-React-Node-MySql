require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getTokensAndUsers } = require('../models/tokensModel.js');

const handleRefreshToken = async (req, res) => {
    console.log("handleRefreshToken");
    // console.log(req);

    const cookies = req.cookies;
    console.log("cookies");
    console.log(cookies);

    if (!cookies?.jwt_refreshToken) {
        const error = {
            message: "ERROR, you need log in",
            status: 401
        };
        return res.status(401).send(error);
    }

    const refreshToken = cookies.jwt_refreshToken;
    const users = await getTokensAndUsers();
    const foundUser = users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403); // Forbidden

    const role = foundUser.role;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );

            res.cookie('jwt_accessToken', accessToken, { httpOnly: true, maxAge: 30 * 1000 });
            return res.json({ accessToken }); // Return JSON response
        }
    );
}

module.exports = { handleRefreshToken };