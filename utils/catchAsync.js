//////////////////////////////
// Wrapper Function for all Async
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

module.exports = catchAsync;

// The async function is being passed as an argument to the catchAsync function.
// The reason for this is to move the error handling outside this async function
// to write DRY (Do Not Repeat Yourself) code. By doing so, because async functions
//  always returns a promise (and as we know promises can either be resolved or rejected),
//  then this allows us to pass that functionality to the catchAsync function.
//  Now, I saw Adam mention in a response that when returning a middleware function,
//  Express passes the 3 arguments (req, res, next).

// Given that, had we not wrapped fn inside the anonymous function we returned,
// then fn would be executed immediately. We don't want that.
// We want express to execute it when a request is made. So by wrapping it inside of
// the anonymous function, we're not executing it, because it's not a function call.
// Now, because Express is expecting a function as an argument whenever a request is
// made, Express will only then execute codeblock and therefore execute fn.
// Now, fn as we remember is an async function, so if the promise returned from fn is
// not resolved, then it's rejected and must be caught, so we'd append the .catch.

// Also, important to rememeber that the Express HTTP methods expects a
// callback function. Which is not possible if you return a IIFE. Hence, the need to
// return a function.
