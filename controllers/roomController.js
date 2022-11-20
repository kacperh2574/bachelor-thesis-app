const Room = require('../models/roomModel');
const RoomReqSpec = require('../utilities/roomReqSpec');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');

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

exports.getAllRooms = catchAsync(async (req, res, next) => {
    const features = new RoomReqSpec(Room.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // returns resolve (after chaining all required methods)
    const rooms = await features.query;

    res.status(200).json({
        status: 'success',
        results: rooms.length,
        data: {
            rooms,
        },
    });
});

exports.getRoom = catchAsync(async (req, res, next) => {
    const room = await Room.findById(req.params.id).populate('reviews');

    if (!room) {
        return next(new AppError('Room not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            room,
        },
    });
});

exports.createRoom = catchAsync(async (req, res, next) => {
    const newRoom = await Room.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            room: newRoom,
        },
    });
});

exports.updateRoom = catchAsync(async (req, res, next) => {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!room) {
        return next(new AppError('Room not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            room,
        },
    });
});

exports.deleteRoom = catchAsync(async (req, res, next) => {
    if (!(await Room.findByIdAndDelete(req.params.id))) {
        return next(new AppError('Room not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
