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
    .get(roomController.getAllRooms)
    .post(
        authController.protect,
        authController.restrictTo('manager', 'admin'),
        roomController.createRoom
    );

router
    .route('/:id')
    .get(roomController.getRoom)
    .patch(
        authController.protect,
        authController.restrictTo('manager', 'admin'),
        roomController.updateRoom
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        roomController.deleteRoom
    );

module.exports = router;
