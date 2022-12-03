/* eslint-disable no-console */
const mongoose = require('mongoose');
// Module to convert name to slugs
const slugify = require('slugify');
// Useful module for custom validation
// eslint-disable-next-line no-unused-vars
const validator = require('validator');
// const User = require('./userModel');

// Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true, // Remove all whitespaces at the beginning and the end
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // Not shown to query results
      select: false,
    },
    startDates: [Date], // An array of dates
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point', // Tells mongo this is a geo-coordinate
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // Whenever the document gets outputted as JSON, make sure that the virtual field exists
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Single Field Index
tourSchema.index({ slug: 1 });

// Compound index (Works individually as well)
// 1 - ascending, -1 - descending
tourSchema.index({ price: 1, ratingsAverage: -1 });

tourSchema.index({ startLocation: '2dsphere' });

// VIRTUALS - WILL NOT BE PERSISTED TO THE DATABASE
tourSchema.virtual('durationWeeks').get(function () {
  // use a regular function to access the this keyword
  return this.duration / 7;
});

// VIRTUALS POPULATE - field not stored in the schema
tourSchema.virtual('reviews', {
  ref: 'Review', // Model we want to reference
  // Connect the ID stored in 'tour' field in the Review Model to the ID stored in the '_id' field locally.
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE : runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next(); // remember to call next
});

// Embedding Guides into Tours
// (BAD SOLUTION - Would have to update every tour if tour guide ever changed)
// To embed is to save the "references" to the database.
// To reference is to store only a part of the object
/*
tourSchema.pre('save', async function (next) {
  // Returns an array of promises
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
*/

// QUERY MIDDLEWARE
// /^find/ deals with both findOne and findMany
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// Populating all search queries
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  if (!Object.keys(this.pipeline()[0]).includes('$geoNear')) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  }
  next();
});

// Create Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
