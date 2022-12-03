/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const path = require('path');
const cookieParser = require('cookie-parser');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookRouter = require('./routes/bookingRoute');

// Init app
const app = express();

// PUG TEMPLATE
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//////////////////////////////////////
// REQUEST -> MIDDLEWARE -> ROUTES  //
//////////////////////////////////////

//////////////////////////////
// GLOBAL MIDDLEWARE

// This is a built-in middleware function in Express.
// It serves static files and is based on serve-static.
app.use(express.static(path.join(__dirname, `public`)));

// Set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from the same API
const limiter = rateLimit({
  // Limiting number of requests
  max: 100,
  // Time out duration
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Body parser, reading data from body to req.body
app.use(express.json({ limit: '10kb' })); // Parses JSON string to Object

// Read Cookies
app.use(cookieParser());

// Parse forms
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  })
);

// Requested Time middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

///////////////////////////
// RENDERING TEMPLATES
app.use('/', viewRouter);

/////////////////////////////////////////////////////////
// ROUTE MIDDLEWARES
// ROUTES <- Model (CRUD METHODS) <- Schema (Validation)
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/reviews', reviewRouter);

app.use('/api/v1/bookings', bookRouter);

// Unknown routes
// Run this if url don't match any above
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//////////////////////////////
// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
