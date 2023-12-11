/* eslint-disable prettier/prettier */
const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReview)
    .post(authController.restricTo('user'),
        reviewController.setUserIds,
        // reviewController.checkBooking,
        reviewController.createReview);

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restricTo('user', 'admin'), reviewController.updateReview)
    .delete(authController.restricTo('user', 'admin'), reviewController.deleteReview);


module.exports = router;

