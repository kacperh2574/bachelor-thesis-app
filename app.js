const express = require('express');
const morgan = require('morgan');

const roomRouter = require('./routes/roomRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// middleware
app.use(morgan('dev')); // request logger (method, status code, elapsed time)
app.use(express.json()); // parses JSON and returns JS object

// routes
app.use('/api/rooms', roomRouter);
app.use('/api/users', userRouter);

// handle not existing routes
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'failure',
        message: `Cannot find ${req.originalUrl}`,
    });
    next();
});

module.exports = app;
