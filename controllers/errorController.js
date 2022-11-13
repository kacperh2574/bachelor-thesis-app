const AppError = require('./../utilities/appError');

// requests with invalid ID
const invalidID = err => {
    const message = `Invalid room ID: ${err.value}`;
    return new AppError(message, 400);
};

// requests with unique room fields already in place
const duplicatedFields = err => {
    const value = Object.keys(err.keyValue);
    const message = `Duplicated room data: ${value}`;
    return new AppError(message, 400);
};

// requests with validation failure
const validationError = err => {
    const errors = Object.values(err.errors).map(
        el => `${el.path}: ${el.message}`
    );
    const message = `Invalid room data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendError = (err, res) => {
    // send info about known errors to client
    if (err.isKnown) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // not send info about unknown errors to client
        console.error('Error', Object.values(err.errors));

        res.status(500).json({
            status: 'error',
            message: 'Unknown error',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    let error = { ...err };

    if (error.kind === 'ObjectId') error = invalidID(error);
    if (error.code === 11000) error = duplicatedFields(error);
    if (error._message === 'Validation failed') {
        error = validationError(error);
    }
    sendError(error, res);
};
