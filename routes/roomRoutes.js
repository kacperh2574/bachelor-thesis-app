const express = require('express');
const roomController = require('../controllers/roomController');
const router = express.Router();

router
    .route('/top-rated')
    .get(roomController.aliasTopRated, roomController.getAllRooms);

router
    .route('/cheapest')
    .get(roomController.aliasCheapest, roomController.getAllRooms);

router
    .route('/')
    .get(roomController.getAllRooms)
    .post(roomController.createRoom);

router
    .route('/:slug')
    .get(roomController.getRoom)
    .patch(roomController.updateRoom)
    .delete(roomController.deleteRoom);

module.exports = router;
