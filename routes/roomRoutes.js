const express = require('express');
const roomController = require('../controllers/roomController');
const authController = require('../controllers/authController');
const router = express.Router();

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

module.exports = router;
