const Review = require('../models/reviewModel');
const mainController = require('./mainController');

exports.setIds = (req, res, next) => {
    // allow nested routes
    if (!req.body.room) req.body.room = req.params.roomId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getAllReviews = mainController.getAll(Review);
exports.getReview = mainController.getOne(Review);
exports.createReview = mainController.createOne(Review);
exports.updateReview = mainController.updateOne(Review);
exports.deleteReview = mainController.deleteOne(Review);
