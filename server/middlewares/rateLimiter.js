const limiter = require("express-rate-limit");

const rateLimiter = limiter({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS,
    limit: process.env.RATE_LIMIT,
    message: "Too many requests, please try again later."
});

module.exports = rateLimiter;
