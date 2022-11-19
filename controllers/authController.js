const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const sendEmail = require('../utilities/emailSender');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
};

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    // create new user basing on send data (excluding isAdmin)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwdConfirm: req.body.passwdConfirm,
        passwdChangedAt: req.body.passwdChangedAt,
    });
    createAndSendToken(newUser, 201, res);
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
    createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // check if user is logged in
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Login required', 401));
    }
    // check if payload has not been modified (force return of Promise using promisify)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('User no longer exists', 401));
    }
    // check if user changed password after token issue
    if (currentUser.changedPasswdAfter(decoded.iat)) {
        return next(
            new AppError('Password recently changed - login again', 401)
        );
    }
    // grant access to protected route (forward User)
    req.user = currentUser;
    next();
});

// get access to arguments
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // regular user role
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('No permission to perform this action', 403)
            );
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // get user basing on requested email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('No valid email in request', 404));
    }
    // create reset token and save
    const resetToken = user.createPassResetToken();
    await user.save({ validateBeforeSave: false });
    // create valid URL
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/users/resetPassword/${resetToken}`;
    // create message to send
    const message = `Send PATCH request containing new password and its confirmation to: ${resetURL}`;
    console.log(message);
    // send email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token is valid for 10 minutes',
            message,
        });
        // create response
        res.status(200).json({
            status: 'success',
            message: 'Token send in email message',
        });
    } catch (err) {
        user.passwdResetToken = undefined;
        user.passwdResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Error occured', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // get user basing on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User.findOne({
        passwdResetToken: hashedToken,
        passwdResetExpires: { $gt: Date.now() + 60 * 60 * 1000 },
    });
    console.log('PASSWD RESET EXP');
    console.log(user.passwdResetExpires);
    // if user exists and token is valid - set new password
    if (!user) {
        return next(new AppError('Invalid or expired token', 400));
    }
    user.password = req.body.password;
    user.passwdConfirm = req.body.passwdConfirm;
    user.passwdResetToken = undefined;
    user.passwdResetExpires = undefined;
    await user.save();
    createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // check if send password is correct
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.verifyPassword(req.body.passwdCurrent))) {
        return next(new AppError('Wrong password', 401));
    }
    // update password
    user.password = req.body.password;
    user.passwdConfirm = req.body.passwdConfirm;
    await user.save();
    createAndSendToken(user, 200, res);
});
