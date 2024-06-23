// const verifyRoles = (...allowedRoles) => {
//     return (req, res, next) => {
//         console.log(...allowedRoles);
//         console.log(req.roles);
//         if (!req?.roles) return res.sendStatus(401);
//         const rolesArray = [...allowedRoles];
//         const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
//         console.log(result);
//         if (!result) return res.sendStatus(401);
//         next();
//     }
// }

// module.exports = verifyRoles

const ROLES_LIST = require('../config/role_list'); // Assuming your roles are exported correctly

const verifyRoles = (allowedRoles) => {
    return (req, res, next) => {
        console.log(allowedRoles +"allowedRoles");

        console.log(req.roles);
        
        if (!req.roles || !Array.isArray(req.roles)) {
            console.log("WOWWWW");
            return res.sendStatus(401);
        }
        
        const rolesArray = allowedRoles;
        const result = req.roles.some(role => rolesArray.includes(role));

        console.log(result);
        if (!result) {
            console.log("PPPPPPPPPPPPPP");

            return res.sendStatus(401);
        }
        
        next();
    }
}

module.exports = verifyRoles;
