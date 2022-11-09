const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    // create new user basing on send data (excluding isAdmin)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwdConfirm: req.body.passwdConfirm,
    });
    // generate JWT token for user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
};

// exports.login = async (req, res, next) => {
//     const { email, password } = req.body;
//     if (email && password)
// };
