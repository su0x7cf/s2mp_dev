const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
}

generateToken.verify = (token) => {
    return require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
};

module.exports = generateToken;
