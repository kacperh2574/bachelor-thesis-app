const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./../models/roomModel')

dotenv.config();

const DB = process.env.DATABASE.replace('<PASSWD>', process.env.DATABASE_PASSWD);

mongoose.connect(DB, {
  useNewUrlParser: true
})
.then(() => console.log('Database connected...'));

const rooms = JSON.parse(fs.readFileSync(`${__dirname}/rooms.json`, 'utf-8'));

// import data to DB
const importData = async () => {
    try {
        await Room.create(rooms);
        console.log('Data loaded');
    } catch(err) {
        console.log(err);
    }
    process.exit();
};

// delete data from DB
const deleteData = async () => {
    try {
        await Room.deleteMany();
        console.log('Data deleted');
    } catch(err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);