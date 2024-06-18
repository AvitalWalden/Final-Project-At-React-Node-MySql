const config = require('../config/config.js');
const jwt = require('jsonwebtoken');

async function handleRefreshToken(userName, password) {
    try {
        const cookies = req.cookies;
        if(!cookies?.jwt){
            return 403;
        }
        
        const user = await model.logIn(userName);
        if (user) {
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            if (user.password === hashedPassword) {

                const accessToken = jwt.sign(
                    { "username": user.username },
                    config.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );
         
                const refreshToken = jwt.sign(
                    { "username": user.username },
                    config.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );
                return { user, accessToken, refreshToken };
            } else {
                throw new Error('You are not exist in the system, please sign up');
            }
        }
        else {
            throw new Error('You are not exist in the system, please sign up');
        }
    } catch (err) {
        throw err;
    }

}