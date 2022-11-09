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
        validate: [
            validator.isEmail,
            'Valid email required, i.e. username@domain.com',
        ],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        minlength: [8, 'Minimum 8 characters'],
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
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwdConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
