const mongoose = require('mongoose');
const slugify = require('slugify');

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name required'],
            unique: true,
            trim: true,
            minlength: [10, 'Minimum 10 characters'],
            maxlength: [50, 'Maximum 50 characters'],
        },
        slug: {
            type: String,
            unique: true,
        },
        duration: {
            type: Number,
            required: [true, 'Duration required'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'Group size required'],
        },
        difficulty: {
            type: String,
            required: [true, 'Difficulty required'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Possible values - easy, medium, difficult',
            },
        },
        ratingsAvg: {
            type: Number,
            default: 4.5,
            min: [1.0, 'Possible value between 1.0 and 5.0'],
            max: [5.0, 'Possible value between 1.0 and 5.0'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Price required'],
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'Summary required'],
        },
        description: {
            type: String,
            trim: true,
        },
        imgCover: {
            type: String,
            required: [true, 'Cover image required'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

roomSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'room',
    localField: '_id',
});

// not arrow function to get access to "this" keyword
// slug will be implemented later
roomSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
