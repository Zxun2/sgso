/* eslint-disable no-console */
// to access .env files
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// UNCAUGHT EXCEPTIONS (Should be placed before app)
process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION 💥 SHUTTING DOWN... ');
  console.log(err.name, err.message);

  // 1 - Rejections. 0 - Success.
  process.exit(1);
});

// Configuring environment
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connecting to Database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, { <= use this if developing locally
  .connect(DB, {
    // Copy & Paste this
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) =>
    console.log(con.connections, 'DB connected successfully 😂😂')
  );

// Listening for request
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App runnning on port ${port}... ❤❤❤`);
});

// UNHANDLED PROMISE REJECTIONS
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTIONS 💥 SHUTTING DOWN... ');
  console.log(err.name, err.message);

  // Close server gracefully
  server.close(() => {
    // 1 - Rejections. 0 - Success.
    process.exit(1);
  });
});
