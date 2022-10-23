const express = require('express');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(express.json());

// tymczasowo lokalny plik JSON zamiast bazy danych aby zacząć tworzyć API
const rooms = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/rooms.json`)
);

app.get('/api/v1/rooms', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: rooms.length,
        data: {
            rooms
        }
    });
});

app.get('/api/v1/rooms/:id', (req, res) => {
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
});

app.post('/api/v1/rooms', (req, res) => {
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
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});