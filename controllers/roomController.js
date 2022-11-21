const Room = require('../models/roomModel');
const mainController = require('./mainController');

exports.aliasTopRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAvg,price';
    next();
};

exports.aliasCheapest = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAvg';
    next();
};

exports.getAllRooms = mainController.getAll(Room);
exports.getRoom = mainController.getOne(Room, { path: 'reviews' });
exports.createRoom = mainController.createOne(Room);
exports.updateRoom = mainController.updateOne(Room);
exports.deleteRoom = mainController.deleteOne(Room);
