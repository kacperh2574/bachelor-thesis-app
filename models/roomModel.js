const mongoose = require('mongoose');

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

  module.exports = Room;