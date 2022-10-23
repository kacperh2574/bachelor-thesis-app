const express = require('express');

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

const router = express.Router();

router
.route('/')
.get(getAllUsers)
.post(createUser);

router
.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);

module.exports = router;