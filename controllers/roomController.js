const Room = require('.././models/roomModel');

// check if a posted room has a name and price
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "failure",
            message: "Missing name or price"
        });
    };
    next();
};

exports.getAllRooms = (req, res) => {
    res.status(200).json({
        status: 'success',
        // results: `Found ${rooms.length} escape rooms`,
        // data: {
        //     rooms
        // }
    });
};

exports.getRoom = (req, res) => {
    const id = Number(req.params.id);
    // const room = rooms.find(el => el.id === id);
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         room
    //     }
    // });
};

exports.createRoom = (req, res) => {
    res.status(201).json({
        status: 'success',
        // data: {
        //     newRoom
        // }
    });
};

exports.updateRoom = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            room: '(updated room here)'
        }
    });
};

exports.deleteRoom = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};