const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user',
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
    passwdChangedAt: Date,
    passwdResetToken: String,
    passwdResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
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

userSchema.pre('save', function (next) {
    // check if password is modified to assign new change date
    if (!this.isModified('password') || this.isNew) return next();
    this.passwdChangedAt = Date.now() + 60 * 60 * 1000;
    next();
});

userSchema.pre('find', function (next) {
    // match all active users
    this.find({ active: true });
    next();
});

userSchema.methods.verifyPassword = async function (userPassword) {
    // compare send and user password
    return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.changedPasswdAfter = function (jwtTimestamp) {
    if (this.passwdChangedAt) {
        const changedTimestamp = parseInt(
            this.passwdChangedAt.getTime() / 1000,
            10
        );
        return jwtTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.createPassResetToken = function () {
    // create and hash random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwdResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // 10 minutes (don't know why JS read Date with 1 hour delay)
    this.passwdResetExpires = Date.now() + 70 * 60 * 1000;
    console.log(this.passwdResetExpires);
    // send token in plain text
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
