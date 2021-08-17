const express = require('express');
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  createTourUserIds,
  getReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');
const { checkIfBooked } = require('../controllers/bookingController');

//////////////////////////////
// ROUTES
// Allows handlers to have access to previous params
const router = express.Router({ mergeParams: true });

//////////////////////////////
// Req incoming from /tours/:id/reviews and api/v1/reviews

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), createTourUserIds, checkIfBooked, createReview);

router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

module.exports = router;
