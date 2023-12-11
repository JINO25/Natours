/* eslint-disable prettier/prettier */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/no-extraneous-dependencies */
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');
// const Booking = require('../models/bookingModel');
// const AppError = require('./../utils/appError');


exports.setUserIds = (req, res, next) => {
    //Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}

// exports.checkBooking = catchAsync(async (req, res, next) => {
//     const bookings = await Booking.find({
//         user: req.user.id,
//         tour: req.body.tour
//     });
//     if (bookings.length === 0) {
//         return next(new AppError('You can review the booked tour', 401));
//     }
// })

exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
