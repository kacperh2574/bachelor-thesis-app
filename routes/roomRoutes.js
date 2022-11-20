const express = require('express');
const roomController = require('../controllers/roomController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');
const router = express.Router();

router.use('/:roomId/reviews', reviewRouter);

router
    .route('/top-rated')
    .get(roomController.aliasTopRated, roomController.getAllRooms);

router
    .route('/cheapest')
    .get(roomController.aliasCheapest, roomController.getAllRooms);

router
    .route('/')
    .get(authController.protect, roomController.getAllRooms)
    .post(roomController.createRoom);

router
    .route('/:id')
    .get(roomController.getRoom)
    .patch(roomController.updateRoom)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        roomController.deleteRoom
    );

// router
//     .route('/:roomId/reviews')
//     .post(
//         authController.protect,
//         authController.restrictTo('user'),
//         reviewController.createReview
//     );

module.exports = router;
