/* eslint-disable */

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    //1) Get the data for the requested tour (including guides and reviews)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    })
    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    let booked = false;

    // Check if the user is logged in
    if (res.locals.user) {
        // If logged in, check if the user has booked the tour
        const booking = await Booking.findOne({
            user: res.locals.user._id,
            tour: tour._id
        });

        booked = !!booking;
    }

    // const booking = await Booking.findOne({
    //     user: res.locals.user._id, // Assuming res.locals.user is the current user
    //     tour: tour._id
    // });

    // const booked = !!booking;

    // 2) Build template
    // 3) Render template using data from 1)
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
        booked
    });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
    // 2) Build template
    // 3) Render template using data from 1)
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Change this to match your client's origin
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' http://127.0.0.1:3000 https://cdnjs.cloudflare.com "
    ).render('login', {
        title: 'Login into your account'
    });
});

exports.getSignupForm = catchAsync(async (req, res, next) => {
    // 2) Build template
    // 3) Render template using data from 1)
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Change this to match your client's origin
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' http://127.0.0.1:3000 https://cdnjs.cloudflare.com"
    ).render('signup', {
        title: 'Sign up your account'
    });
});

exports.getAccount = (req, res, next) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    // console.log(tourIDs)
    const tours = await Tour.find({ _id: { $in: tourIDs } });
    // console.log(tours)

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    });
});

exports.getMyReview = catchAsync(async (req, res, next) => {
    // 1) Find all reviews
    const reviews = await Review.find({ user: req.user.id });

    // 2) Populate the 'tour' field in each review
    const myReviews = await Review.populate(reviews, { path: 'tour' });

    res.status(200).render('my-review', {
        title: 'My Review',
        myReviews
    });
});


exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});