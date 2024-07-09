const model = require('../models/usersModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');
const { creatTokenDB, updateToken } = require('../models/tokensModel.js');

async function createUser(username, password, role) {
    try {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = await model.createUser(username, hashedPassword, role);

        const getNewUser = await getUser(user.insertId);
        const token = await creatTokens(getNewUser, role);

        creatTokenDB(user.insertId, token.refreshToken);
        const accessToken = token.accessToken
        const refreshToken = token.refreshToken
        return { user, accessToken, refreshToken };
    } catch (err) {
        if (err.sqlMessage == `Duplicate entry '${username}' for key 'users.username'`) {
            throw new Error('Username is in use')
        } else {
            throw err;
        }
    }
}

async function createUserLogInWithGoogle(username, role, email) {
    try {
        const user = await model.createUserLogInWithGoogle(username, role, email);
        const newUser = await getUser(user.insertId);

        const token = await creatTokens(newUser, role);
        creatTokenDB(user.insertId, token.refreshToken);
        const accessToken = token.accessToken
        const refreshToken = token.refreshToken;
        return { user, accessToken, refreshToken };
    } catch (err) {
        if (err.sqlMessage == `Duplicate entry '${username}' for key 'users.username'`) {
            throw new Error('You need logIn')
        } else if (err.sqlMessage == `Duplicate entry '${email}' for key 'users.email'`) {
            throw new Error('email is in use')
        }else {
            throw err;
        }
    }
}

async function getUserLogInWithGoogle(email) {
    try {
        const user = await model.getUserByEmail(email);
        if (!user) {
            throw new Error('Email does not exist in the system');
        }
        const token = await creatTokens(user, user.role);
        updateToken(user.user_id, token.refreshToken);
        const accessToken = token.accessToken
        const refreshToken = token.refreshToken;
        return { user, accessToken, refreshToken };
    } catch (err) {
        throw err;
    }
}

async function logIn(userName, password) {
    try {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = await model.logIn(userName);

        if (user) {
            const role = user.role;
            if (hashedPassword === user.password) {
                token = await creatTokens(user, role);
                updateToken(user.user_id, token.refreshToken);
                const accessToken = token.accessToken
                const refreshToken = token.refreshToken
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
        return await model.getUser(id);
    } catch (err) {
        throw err;
    }
}

async function getUserByEmail(email) {
    try {
        return await model.getUserByEmail(email);
    } catch (err) {
        throw err;
    }
}

async function updateUser(id, name, username, email, city, street, zipcode, phone, addressId) {
    try {
        return await model.updateUser(id, name, username, email, city, street, zipcode, phone, addressId);
    } catch (err) {
        if (err.sqlMessage == `Duplicate entry '${email}' for key 'users.email'`) {
            throw new Error('email is in use')
        }
        else if (err.sqlMessage == `Duplicate entry '${email}' for key 'users.email'`) {
            throw new Error('email is in use')
        }
        else{
            throw err;
        }
    }
}

async function createNewUser(name, username, email, phone, city, street, zipcode) {
    try {
        return await model.createNewUser(name, username, email, phone, city, street, zipcode);
    } catch (err) {
        throw err;
    }
}

async function creatTokens(user, role) {
    try {
        const username = user.username;
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": username,
                    "role": role
                }
            },
            config.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' }
        );

        const refreshToken = jwt.sign(
            {
                "username": username,
                "role": role
            },
            config.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const token = {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        return token;
    } catch (err) {
        throw err;
    }
}

module.exports = { createUser, getUser, updateUser, logIn, createNewUser, createUserLogInWithGoogle, getUserByEmail, getUserLogInWithGoogle }