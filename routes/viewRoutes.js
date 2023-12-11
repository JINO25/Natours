/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-useless-path-segments */
const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, bookingController.createBookingCheckout, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
    '/my-tours',
    bookingController.createBookingCheckout,
    authController.protect,
    viewsController.getMyTours
);

router.get(
    '/my-reviews',
    authController.protect,
    viewsController.getMyReview)

router.post(
    '/submit-user-data',
    authController.protect,
    viewsController.updateUserData
);

module.exports = router;