const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const mainController = require('./mainController');

exports.getAllUsers = mainController.getAll(User);
exports.getUser = mainController.getOne(User);
exports.updateUser = mainController.updateOne(User); // NOT for password
exports.deleteUser = mainController.deleteOne(User);

const filterObject = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Use /signup instead',
    });
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // check if user post password to change
    if (req.body.password || req.body.passwdConfirm) {
        return next(new AppError('Use /updatePassword instead', 400));
    }
    // filter out disallowed fields
    const filteredBody = filterObject(req.body, 'name', 'email');
    // update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
