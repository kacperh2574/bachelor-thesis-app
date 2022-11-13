const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Valid email required'],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: [8, 'Minimum 8 characters'],
        select: false,
    },
    passwdConfirm: {
        type: String,
        required: [true, 'Password confirmation required'],
        minlength: [8, 'Minimum 8 characters'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match',
        },
    },
});

userSchema.pre('save', async function (next) {
    // check if password was modified
    if (!this.isModified('password')) return next();
    // salt and hash password
    this.password = await bcrypt.hash(this.password, 12);
    // erase passwdConfirm field
    this.passwdConfirm = undefined;
    next();
});

userSchema.methods.verifyPassword = async function (userPassword) {
    // compare send and user password
    return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
