const fs = require('fs');

// JSON file used instead of a database to develop and test basic API
const rooms = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/rooms.json`)
);

// check if a room with requested ID even exists
exports.checkId = (req, res, next, val) => {
    if (val >= rooms.length) {
        return res.status(404).json({
            status: "failure",
            message: "Invalid ID"
        });
    };
    next();
};

exports.getAllRooms = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: `Found ${rooms.length} escape rooms`,
        data: {
            rooms
        }
    });
};

exports.getRoom = (req, res) => {
    const id = Number(req.params.id);
    const room = rooms.find(el => el.id === id);
    res.status(200).json({
        status: 'success',
        data: {
            room
        }
    });
};

exports.createRoom = (req, res) => {
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