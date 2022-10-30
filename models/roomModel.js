const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A room must have a name'],
      unique: true,
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'A room must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A room must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A room must have a difficulty']
    },
    ratingsAvg: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A room must have a price']
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A room must have a summary']
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A room must have a description']
    },
    imgCover: {
      type: String,
      required: [true, 'A room must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    }
  });
  const Room = mongoose.model('Room', roomSchema);

  module.exports = Room;