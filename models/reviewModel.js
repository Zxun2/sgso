const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Parent Referencing
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!'],
    },
  },
  {
    // For virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//////////////////////////////
// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  // Be careful about chaining such methods. Might lead to slow queries.
  this.populate({
    path: 'user',
  });
  // .populate({
  //   path: 'tour',
  // });

  next();
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
//////////////////////////////
// STATIC METHOD ON MODEL TO CALC AVERAGE RATINGS
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // This points to model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

//////////////////////////////
// DOCUMENT/QUERY MIDDLEWARE TO CALC AVERAGE RATINGS
// If your post hook function takes at least 2 parameters,
// mongoose will assume the second parameter is a next() function that
// you will call to trigger the next middleware in the sequence.
// Works after SAVIING/DELETING/UDPATING
reviewSchema.post(/save|^findOneAnd/, async (doc, next) => {
  await doc.constructor.calcAverageRatings(doc.tour);
  next();
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
