const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const jwt_secret = process.env.JWT_TOKEN_SECRET;
const jwt_expirey = process.env.JWT_TOKEN_EXPIREY;

const sign_jwt = payload => jwt.sign(payload, jwt_secret, { expiresIn: jwt_expirey });

const verify_jwt = token => jwt.verify(token, jwt_secret);

module.exports = { sign_jwt, verify_jwt }
