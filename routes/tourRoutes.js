const express = require('express');
const {
  getAllTours,
  createTour,
  deleteTour,
  updateTour,
  getTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../controllers/tourController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

//////////////////////////////
// ROUTES
const router = express.Router();

// router.param('id', checkID);

//////////////////////////////
// Req incoming from /tours
router.use('/:tourId/reviews', reviewRouter); // Rerouting to reviewRouter

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distance/:latlng/unit/:unit').get(getDistances);
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  );

module.exports = router;
