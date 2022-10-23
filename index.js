const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const port = 5000;


// tymczasowo lokalny plik JSON zamiast bazy danych aby zacząć tworzyć API
const rooms = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/rooms.json`)
);

const getAllRooms = (req, res) => {
    res.status(200).json({
        status: 'success',
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

const postRoom = (req, res) => {
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

const patchRoom = (req, res) => {
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

app
.route('/api/v1/rooms')
.get(getAllRooms)
.post(postRoom);

app
.route('/api/v1/rooms/:id')
.get(getRoom)
.patch(patchRoom)
.delete(deleteRoom);

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});