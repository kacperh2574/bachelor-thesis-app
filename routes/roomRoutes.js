const express = require('express');
const fs = require('fs');

const rooms = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/rooms.json`)
);

const getAllRooms = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        results: rooms.length,
        data: {
            rooms
        }
    });
};

const getRoom = (req, res) => {
    const id = req.params.id;
    const room = rooms.find(el => el.id == id);

    if (!room) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            room
        }
    });
};

const createRoom = (req, res) => {
    const newId = rooms[rooms.length - 1].id + 1;
    const newRoom = Object.assign({ id: newId }, req.body);

    rooms.push(newRoom);
    fs.writeFile(
        `${__dirname}/dev-data/rooms.json`,
        JSON.stringify(rooms),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    newRoom
                }
            });
        }
    );
};

const updateRoom = (req, res) => {
    if (req.params.id >= rooms.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            room: '(updated room here)'
        }
    });
};

const deleteRoom = (req, res) => {
    if (req.params.id >= rooms.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }
    
    res.status(204).json({
        status: 'success',
        data: null
    });
};

const router = express.Router();

router
.route('/')
.get(getAllRooms)
.post(createRoom);

router
.route('/:id')
.get(getRoom)
.patch(updateRoom)
.delete(deleteRoom);

module.exports = router;