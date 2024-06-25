
const { getTokensAndUsers,deleteToken} = require('../models/tokensModel.js');

const handleLogout = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt_refreshToken) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt_refreshToken;

    const users = await getTokensAndUsers();
    const foundUser = users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt_refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    await deleteToken(foundUser.user_id);
    res.clearCookie('jwt_refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.clearCookie('jwt_accessToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }