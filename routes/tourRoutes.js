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

const router = express.Router();

// Looking for params id only
// router.param('id', (req, res, next, val) => {
//    console.log(`Tour id is ${val}`);
//    next();
// });

// Req incoming from /tours
router.use('/:tourId/reviews', reviewRouter); // Rerouting to reviewRouter

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distance/:latlng/unit/:unit').get(getDistances);
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin'), createTour);
router
  .route('/:id')
  .get(getTour)
  .delete(protect, restrictTo('admin'), deleteTour)
  .patch(
    protect,
    restrictTo('admin'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  );

module.exports = router;
