const mongoose = require('mongoose');
const Room = require('../models/roomModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review required'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        room: {
            type: mongoose.Schema.ObjectId,
            ref: 'Room',
            required: [true, 'Review must belong to room'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// every user can post only one review for given room
reviewSchema.index({ room: 1, user: 1 }, { unique: true });

// populate reviews
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name',
    });
    next();
});

// calculate average rating of room
reviewSchema.statics.calcRatingsAvg = async function (roomId) {
    const stats = await this.aggregate([
        {
            $match: { room: roomId },
        },
        {
            $group: {
                _id: '$room',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    if (stats.length > 0) {
        await Room.findByIdAndUpdate(roomId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAvg: stats[0].avgRating,
        });
    } else {
        await Room.findByIdAndUpdate(roomId, {
            ratingsQuantity: 0,
            ratingsAvg: 4.5,
        });
    }
};

reviewSchema.post('save', function () {
    // this points to current review
    this.constructor.calcRatingsAvg(this.room);
});

// edit ratingsAvg and ratingsQuantity after delete one
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne().clone();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcRatingsAvg(this.r.room);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
