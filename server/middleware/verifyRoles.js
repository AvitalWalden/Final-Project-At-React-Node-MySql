require('dotenv').config();
const jwt = require('jsonwebtoken');
const refreshTokenController = require('../controllers/refreshTokenController');

const verifyRoles = (allowedRoles) => {
    return async (req, res, next) => {
        try {

       
            console.log("verifyPermissions middleware triggered 2");
            console.log(allowedRoles);
            console.log(req.role);

            if (!req.user) {
                console.log("User is not authenticated");
                return res.status(401).json({ message: "User is not authenticated" });
            }

            // Check if the user has one of the required roles
            if (!allowedRoles.includes(req.role)) {
                console.log(`User with role ID ${req.role} does not have access`);
                return res.status(403).json({ message: "User does not have the required permissions" });
            }

            console.log(`User with role ID ${req.role} has access`);
            next();
        } catch (error) {
            console.error('Error in verifyRoles middleware:', error);
            res.sendStatus(500); 
        }
    };
};

module.exports = verifyRoles;
