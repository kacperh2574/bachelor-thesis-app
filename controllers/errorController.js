const AppError = require('../utilities/appError');

// requests with invalid ID
const invalidID = err => {
    const message = `Invalid ID: ${err.value}`;
    return new AppError(message, 400);
};

// requests with unique fields already in place
const duplicatedFields = err => {
    const value = Object.keys(err.keyValue);
    const message = `Duplicated field(s): ${value}`;
    return new AppError(message, 400);
};

// requests with validation failure
const validationError = err => {
    const errors = Object.values(err.errors).map(
        el => `${el.path}: ${el.message}`
    );
    const message = `Invalid field(s). ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const jwtError = () => new AppError('Invalid token', 401);

const jwtExpired = () => new AppError('Token expired', 401);

const sendError = (err, res) => {
    // send info about known errors to client
    if (err.isKnown) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // not send info about unknown errors to client
        res.status(500).json({
            status: 'error',
            message: 'Unknown error',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    let error = { name: err.name, ...err };
    if (error.name === 'CastError') error = invalidID(error);
    if (error.code === 11000) error = duplicatedFields(error);
    if (error.name === 'ValidationError') {
        error = validationError(error);
    }
    if (error.name === 'JsonWebTokenError') error = jwtError();
    if (error.name === 'TokenExpiredError') error = jwtExpired();
    sendError(error, res);
};
