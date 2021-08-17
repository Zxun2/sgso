/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//////////////////////////////
// UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION 💥 SHUTTING DOWN... ');
  console.log(err.name, err.message);

  // 1 - Rejections. 0 - Success.
  process.exit(1);
});

//////////////////////////////
// Configuring environment
dotenv.config({ path: './config.env' });

const app = require('./app');

//////////////////////////////
// Connecting to Database
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected successfully 😂😂'));

//////////////////////////////
// Listening for request
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App runnning on port ${port}... ❤❤❤`);
});

//////////////////////////////
// UNHANDLED PROMISE REJECTIONS
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTIONS 💥 SHUTTING DOWN... ');
  console.log(err.name, err.message);
  server.close(() => {
    // 1 - Rejections. 0 - Success.
    process.exit(1);
  });
});
