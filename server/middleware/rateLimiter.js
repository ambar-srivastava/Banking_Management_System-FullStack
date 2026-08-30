const rateLimit = require('express-rate-limit');

const skip = () => process.env.NODE_ENV === 'test'

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests, please try again later'
    },
    skip,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many login attemps, please try again in 15 minutes' },
    skip,
});

module.exports = { generalLimiter, authLimiter };