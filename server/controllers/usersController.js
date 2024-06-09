const model = require('../models/usersModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');



async function createUser(username, password) {
    try {
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
                console.log(refreshToken)
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


async function updateUser(id, name, username, email, city, street, zipcode, phone, Bonus, role,addressId) {
    try {
        return model.updateUser(id, name, username, email, city, street, zipcode, phone, Bonus, role,addressId);
    } catch (err) {
        throw err;
    }
}

module.exports = { createUser, getUser, updateUser, logIn, getUserForSignup }