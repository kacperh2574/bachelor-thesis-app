const Room = require('.././models/roomModel');

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
        const queryObj = { ...req.query }; // deep copy of req.query object
        // 1) filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g, // basing on mongoose query selectors
            match => `$${match}`
        );

        // returns Promise
        let query = Room.find(JSON.parse(queryStr));

        // 2) sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // by date ascending
        }

        // 3) field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields); // query projection
        } else {
            query = query.select('-__v'); // excluding __v field
        }

        // 4) pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit); // skip specified amount of rooms, limit results to specified amount

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
