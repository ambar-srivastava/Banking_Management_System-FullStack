// A custom error class that carries an Http status code alongside the message
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // marks this as a "known" error we threw on purpose
    }
}

module.exports = AppError;