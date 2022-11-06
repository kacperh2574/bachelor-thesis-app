const mongoose = require('mongoose');
const validator = require('validator');

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
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
