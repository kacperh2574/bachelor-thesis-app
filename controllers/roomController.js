const Room = require('.././models/roomModel');
const RoomReqSpec = require('../utilities/roomReqSpec');

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

exports.getAllRooms = async (req, res) => {
    try {
        // execute query
        const features = new RoomReqSpec(Room.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // returns resolve (after chaining all required methods)
        const rooms = await features.query;

        // send response
        res.status(200).json({
            status: 'success',
            results: rooms.length,
            data: {
                rooms,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: err,
        });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const room = await Room.find({ slug: req.params.slug });

        res.status(200).json({
            status: 'success',
            data: {
                room,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: err,
        });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const newRoom = await Room.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                room: newRoom,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err,
        });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                room,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err,
        });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        await Room.findOneAndDelete({ slug: req.params.slug });

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: err,
        });
    }
};
