const Room = require('.././models/roomModel');

exports.getAllRooms = async (req, res) => {
    try {
        const queryObj = { ...req.query }; // deep copy of req.query object

        // 1) filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // basing on mongoose query selectors

        // returns Promise
        let query = Room.find(JSON.parse(queryStr));

        // 2) sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // 3) field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 4) pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        // returns resolve (after chaining all required methods)
        const rooms = await query;

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
            message: 'Cannot get all rooms',
        });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                room,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: 'Cannot get a room',
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
            message: 'Cannot create a room',
        });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            data: {
                room,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: 'Cannot update a room',
        });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: 'failure',
            message: 'Cannot delete a room',
        });
    }
};
