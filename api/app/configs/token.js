require('dotenv').config();
module.exports = {
    JWT_TOKEN: process.env.JWT_TOKEN,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_TOKEN_TIME: process.env.JWT_TOKEN_TIME || 1,
}