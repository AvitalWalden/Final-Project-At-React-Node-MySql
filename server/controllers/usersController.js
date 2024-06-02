const model = require('../models/usersModel');
const bcrypt = require('bcrypt');

async function createUser(username, password) {
    try {
        console.log("ddddd");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await model.createUser(username, hashedPassword);
        console.log(user);
        return user;
    } catch (err) {
        if (err.sqlMessage == `Duplicate entry '${username}' for key 'users.username'`) {
            throw new Error('Username is in use')
        } else {
            throw err;
        }
    }
}

async function logIn(userName, password) {
    try {
        console.log("ררר")

        const user = await model.logIn(userName);
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return user;
            }
            else {
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

async function getUser(id) {
    try {
        return model.getUser(id);
    } catch (err) {
        throw err;
    }
}

async function getUserForSignup(id) {
    try {
        return model.getUserForSignup(id);
    } catch (err) {
        throw err;
    }
}


async function updateUser(id, name, username, email, city, street, zipcode, phone, Bonus, role) {
    try {        
        return model.updateUser(id, name, username, email, city, street, zipcode, phone, Bonus, role);
    } catch (err) {
        throw err;
    }
}

module.exports = { createUser, getUser, updateUser, logIn, getUserForSignup }