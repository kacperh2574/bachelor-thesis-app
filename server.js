const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// load environment variables
dotenv.config();

const DB = process.env.DATABASE.replace('<PASSWD>', process.env.DATABASE_PASSWD);

mongoose.connect(DB, {
  useNewUrlParser: true
}).then(() => console.log('Database connected...'));

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A room must have a name'],
    unique: true
  },
  ratingsAvg: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A room must hava a price']
  }
});
const Room = mongoose.model('Room', roomSchema);

const testRoom = new Room({
  name: "The ancient legacy",
  ratingsAvg: 4.2,
  price: 150
});

testRoom.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log('Error: ', err);
});

// start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});