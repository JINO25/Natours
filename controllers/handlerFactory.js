/* eslint-disable prettier/prettier */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable arrow-body-style */
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeature = require("./../utils/apiFeatures");


//This fun delete tours, users, reviews
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('No document found with ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!doc) {
        return next(new AppError('No document found with ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        },
    });

});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    // console.log(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: doc,
        },
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        },
    });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
    //To allow for nested Get review on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //EXECUTE QUERY
    const features = new APIFeature(Model.find(filter), req.query)  //or Tour.find()
        .filter()
        .sort()
        .limitField()
        .paginate();

    const doc = await features.query;

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        },
    });

});