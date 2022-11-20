const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const helmet = require('helmet');

const roomRouter = require('./routes/roomRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const AppError = require('./utilities/appError');
const errorHandler = require('./controllers/errorController');

const app = express();

// set security headers
app.use(helmet());

// limit requests (is it REST?)
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP',
});
app.use('/api', limiter);

// request logger (method, status code, elapsed time)
app.use(morgan('dev'));

// JSON body parser
app.use(express.json({ limit: '10kb' }));

// data sanitization to prevent NoSQL query injection
app.use(mongoSanitize());

// prevent XSS attacks
app.use(xssClean());

// prevent HTTP parameter pollution attacks
app.use(
    hpp({ whitelist: ['duration', 'maxGroupSize', 'difficulty', 'price'] })
);

// routes
app.use('/api/rooms', roomRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);

// not existing routes handler
app.all('*', (req, res, next) => {
    next(new AppError(`Path ${req.originalUrl} not found`, 404));
});

// global error handling middleware
app.use(errorHandler);

module.exports = app;
