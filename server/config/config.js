require('dotenv').config();;
const { PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_PASSWORD,
    CORS_ORIGIN } = process.env;

module.exports = {
    PORT, NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_PASSWORD,
    CORS_ORIGIN
};