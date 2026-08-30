const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
    if (err.code === '23505') {
        return res.status(409).json({
            error: 'A record with that value aready exists'
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: 'Something went wrong on our end' });
}

module.exports = errorHandler;