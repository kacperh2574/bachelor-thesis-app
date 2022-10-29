const Room = require('.././models/roomModel');

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
            message: "Invalid data sent"
        });
    }
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