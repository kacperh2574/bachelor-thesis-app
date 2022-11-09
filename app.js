const express = require('express');
const morgan = require('morgan');

const roomRouter = require('./routes/roomRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utilities/appError');
const errorHandler = require('./controllers/errorController');

const app = express();

// middleware
app.use(morgan('dev')); // request logger (method, status code, elapsed time)
app.use(express.json()); // parses JSON and returns JS object

// routes
app.use('/api/rooms', roomRouter);
app.use('/api/users', userRouter);

// handle not existing routes
app.all('*', (req, res, next) => {
    next(new AppError(`Path ${req.originalUrl} not found`, 404));
});

// global error handling middleware
app.use(errorHandler);

module.exports = app;
