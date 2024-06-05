require('dotenv').config();;
const { PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_PASSWORD,
    CORS_ORIGIN,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
} = process.env;

module.exports = {
    PORT, NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_PASSWORD,
    CORS_ORIGIN,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET
};