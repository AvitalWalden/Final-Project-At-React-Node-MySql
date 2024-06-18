const model = require('../models/usersModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');



async function createUser(username, password) {
    try {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = await model.createUser(username, hashedPassword);
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
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = await model.logIn(userName);
        if (user) {
            if (hashedPassword === user.password){
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
                console.log(refreshToken);
                return { user, accessToken, refreshToken };
            } else {
                throw new Error('Incorrect password. Please try again.');
            }
        } else {
            throw new Error('User does not exist in the system, please sign up.');
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