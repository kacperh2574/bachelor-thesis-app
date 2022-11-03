const Room = require('.././models/roomModel');

exports.getAllRooms = async (req, res) => {
    try {
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        const rooms = await Room.find(queryObj);

        res.status(200).json({
        status: 'success',
        results: rooms.length,
        data: {
            rooms
        }
    });
    } catch(err) {
        res.status(404).json({
            status: "failure",
            message: "Cannot get all rooms"
        });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        res.status(200).json({
                status: 'success',
                data: {
                    room
                }
        });
    } catch(err) {
        res.status(404).json({
            status: "failure",
            message: "Cannot get a room"
        });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const newRoom = await Room.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                room: newRoom
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "failure",
            message: "Cannot create a room"
        });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                room
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'failure',
            message: 'Cannot update a room'
        });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch(err) {
        res.status(400).json({
            status: "failure",
            message: "Cannot delete a room"
        });
    }
};