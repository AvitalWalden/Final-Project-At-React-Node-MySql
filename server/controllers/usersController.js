const model = require('../models/usersModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');
const { creatToken,updateToken } = require('../models/tokensModel.js');

async function createUser(username, password,role) {
    try {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = await model.createUser(username, hashedPassword,role);
        console.log("ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg");
        console.log(user.insertId);

        const g =getUserForSignup(user.insertId);
        const token = await creatTokens(g, role);
        console.log("user",user);

        console.log(token);
        creatToken(user.insertId, token.refreshToken);
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

async function logIn(userName, password) {
    try {
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = await model.logIn(userName);
        if (user) {
            const role = Object.values(user.role);
            console.log("ooo",role)
            if (hashedPassword === user.password) {
                token =await creatTokens(user, role);
                creatTokens(user.user_id, token.refreshToken);
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


async function updateUser(id, name, username, email, city, street, zipcode, phone, Bonus, addressId) {
    try {
        return model.updateUser(id, name, username, email, city, street, zipcode, phone, Bonus, addressId);
    } catch (err) {
        throw err;
    }
}

async function creatTokens(user, role) {
    try {
        console.log("aaaaaaaaaaaaaaaaaaa"+ user.username)
        const accessToken = jwt.sign(
            {
                "UserInf": {
                    "username": user.username,
                    "roles": role
                }
            },
            config.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );

        const refreshToken = jwt.sign(
            { 
                "username": user.username, 
                "roles": role 
            },
            config.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        
        const token =  {
            accessToken: accessToken,
            refreshToken: refreshToken
        }; 
        console.log(token);
        return token;
    } catch (err) {
        throw err;
    }
}

module.exports = { createUser, getUser, updateUser, logIn, getUserForSignup }