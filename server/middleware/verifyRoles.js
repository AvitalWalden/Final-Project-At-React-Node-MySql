
require('dotenv').config();
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../config/role_list'); // Assuming your roles are exported correctly
const refreshTokenController = require('../controllers/refreshTokenController');

const verifyRoles = (allowedRoles) => {
    return async (req, res, next) => {
        let allowedRoleKeys;                

        if (Array.isArray(allowedRoles)) {
            allowedRoleKeys = allowedRoles.map(role => {
                return Object.keys(ROLES_LIST).find(key => ROLES_LIST[key] === role);
            });
        } else {
            allowedRoleKeys = [Object.keys(ROLES_LIST).find(key => ROLES_LIST[key] === allowedRoles)];
        }

        let token = await refreshTokenController.handleRefreshToken(req.cookies);


        let userRoles;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            // if (err) return res.sendStatus(403); // Forbidden if token is invalid
             userRoles = decoded.UserInfo.roles;
           
        });

         let result=false;
            if (allowedRoleKeys.length > 1) {
                result = allowedRoleKeys.includes(userRoles)
            }
            else {
                if (userRoles == allowedRoleKeys[0]) {
                    result = true;
                }
                
            }
             if (result == false) return res.sendStatus(402); 
            next(); 
    };
};

module.exports = verifyRoles;

