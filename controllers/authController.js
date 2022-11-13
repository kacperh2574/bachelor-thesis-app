const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    // create new user basing on send data (excluding isAdmin)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwdConfirm: req.body.passwdConfirm,
    });
    // generate JWT token for user
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // check if email or password exists
    if (!email || !password) {
        return next(new AppError('Email and password required', 400));
    }
    // check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.verifyPassword(password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    // send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
});
