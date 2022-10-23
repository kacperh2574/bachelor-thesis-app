const exp = require('constants');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// middleware
app.use(morgan('dev')); // request logger
app.use(express.json());
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
});

// a local JSON file instead of a database for simple API developing and testing
const rooms = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/rooms.json`)
);

// route handlers
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

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Route undefined'
    })
};

// routes
const roomRouter = express.Router();
const userRouter = express.Router();

roomRouter
.route('/')
.get(getAllRooms)
.post(createRoom);

roomRouter
.route('/:id')
.get(getRoom)
.patch(updateRoom)
.delete(deleteRoom);

userRouter
.route('/')
.get(getAllUsers)
.post(createUser);

userRouter
.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);

app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/users', userRouter);

// start server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});