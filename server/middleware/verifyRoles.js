require('dotenv').config();
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../config/role_list');
const refreshTokenController = require('../controllers/refreshTokenController');

const verifyRoles = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            let allowedRoleKeys;

            if (Array.isArray(allowedRoles)) {
                allowedRoleKeys = allowedRoles.map(role => {
                    return Object.keys(ROLES_LIST).find(key => ROLES_LIST[key] === role);
                });
            } else {
                allowedRoleKeys = [Object.keys(ROLES_LIST).find(key => ROLES_LIST[key] === allowedRoles)];
            }

            let token = await refreshTokenController.handleRefreshToken(req.cookies);
            if (!token) {
                return res.sendStatus(401); // Unauthorized if token is not found
            }

            let userRoles;
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.sendStatus(403); // Forbidden if token is invalid
                }
                userRoles = decoded.UserInfo.roles;
            });

            let result = false;
            if (allowedRoleKeys.length > 1) {
                result = allowedRoleKeys.includes(userRoles);
            } else {
                if (userRoles == allowedRoleKeys[0]) {
                    result = true;
                }
            }

            if (result == false) {
                return res.sendStatus(403); // Forbidden if user does not have the required role
            }

            next();
        } catch (error) {
            console.error('Error in verifyRoles middleware:', error);
            res.sendStatus(500); // Internal Server Error
        }
    };
};

module.exports = verifyRoles;
