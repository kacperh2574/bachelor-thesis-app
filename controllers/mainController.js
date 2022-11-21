const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const ParamsSpec = require('../utilities/paramsSpec');

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('Document not found', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError('Document not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.getOne = (Model, populateOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOptions) query = query.populate(populateOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('Document not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        // to allow nested GET (only for room)
        let filter = {};
        if (req.params.roomId) filter = { room: req.params.roomId };

        const features = new ParamsSpec(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // returns resolve (after chaining all required methods)
        const doc = await features.query;

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                doc,
            },
        });
    });
