# This project is currently ongoing!

---

date updated: '2021-08-12T10:51:22+08:00'

---

# SG Spots

At a time of unprecedented distancing, this web application aims to connect users by promoting famous SG spots all around Singapore. Favorite stargazing spots? You got it! Famous carpool routes? You got it too!

## Table of Contents (To be updated)

1. [Application Structure](#Application-Structure)
2. [API Design](#API-Design)
3. [Environment Configuration](#EnvironmentConfig)
4. [Dependencies](#Dependencies)
5. [Future features](#Future-Features)
6. Library Used:
   <details>
   <summary>Libraries</summary>

   ### Click the links to navigate the page!

   1. [Slugify](#Slugify)
   2. [Validator](#Validators)
   3. [bcrypt](#Bcrypt)
   4. [Crypto](#Crypto)
   5. [Nodemailer](#Nodemailer)
   6. [HTMLtoText](#HTMLtoText)
   7. [Pug](#Pug)
   8. [Express](#Express)
   9. [Morgan](#Morgan)
   10. [Express-rate-limit](#Express-rate-limit)
   11. [Helmet](#Helmet)
   12. [Express-mongo-sanitize](#Express-Mongo-Sanitize)
   13. [Hpp](#Hyperparameter-pollution)
   14. [Xss-clean](#XSS)
   15. [Path](#Path)
   16. [Cookie-parser](#Cookie-parser)
   17. [Dotenv](#Dotenv)
   18. [JsonWebToken](#JsonWebToken)
   19. [Util](#Util)
   20. [Stripe](#Stripe)
   21. [Multer](#Multer)
   22. [Sharp](#Sharp)
   23. [Axios](#Axios)
   24. [Mapbox](#Mapbox)

   </details>

## Application-Structure

A clearer version can be found in the folder labelled "Application Structure".

![image](https://user-images.githubusercontent.com/63457492/129500508-f8088c2c-ee74-4a87-8bbf-6bb3c815bd08.png)

## API-Design

The project has adopted the REST architectural style.

<details>
<summary> Read this if you are unclear what exactly is a REST API </summary>

A REST API (also known as RESTful API) is an application programming interface (API or web API) that conforms to the constraints of REST architectural style and allows for interaction with RESTful web services. REST stands for representational state transfer and was created by computer scientist Roy Fielding.

Source: ![https://www.redhat.com/en/topics/api/what-is-a-rest-api](https://www.redhat.com/en/topics/api/what-is-a-rest-api)

</details>

In general, the API is expected to follow the following guidelines:

1. The API should be separated into logical resources.
   => Tours, Reviews, Users etc.
2. Exposed structured, resource-based URLs.
   => {API_URL}/api/v1/users/:id/address/:address
3. Data transfer via HTTP Methods
   => GET, POST, PATCH, DELETE
4. Send data is JSON Format
5. Be stateless
   => All state is handled on the client. This means that each request should contain all the information necessary in order to process a certain request. The API should have to remember previous requests.
   => implemented within application: LoggedIn, Paginate

## EnvironmentConfig

Environment Configuration for the project.

```text
NODE_ENV=development
PORT=3000

DATABASE_PASSWORD=
DATABASE=
DATABASE_LOCAL=

JWT_SECRET=
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=

EMAIL_FROM=zxun2000@gmail.com

SENDGRID_USERNAME=apikey
SENDGRID_PASSWORD=

STRIPE_SECRET_KEY=
```

## Dependencies

Dependencies for the project are stated below:

```js
"dependencies": {
 "@babel/polyfill": "^7.12.1",
 "axios": "^0.21.1",
 "bcryptjs": "^2.4.3",
 "cookie-parser": "^1.4.5",
 "core-js": "^3.6.4",
 "dotenv": "^10.0.0",
 "express": "^4.17.1",
 "express-csp": "^0.1.3",
 "express-mongo-sanitize": "^2.1.0",
 "express-rate-limit": "^5.3.0",
 "helmet": "^4.6.0",
 "hpp": "^0.2.3",
 "html-to-text": "^8.0.0",
 "jsonwebtoken": "^8.5.1",
 "mapbox-gl": "^2.4.0",
 "mongoose": "^5.13.3",
 "morgan": "^1.10.0",
 "multer": "^1.4.2",
 "nodemailer": "^6.6.3",
 "pug": "^3.0.2",
 "regenerator-runtime": "^0.13.7",
 "sharp": "^0.28.3",
 "slugify": "^1.6.0",
 "stripe": "^8.168.0",
 "validator": "^13.6.0",
 "xss-clean": "^0.1.1"
 },
```

## Future-Features

1. Currently exploring application integration with Stripe for payment services.
2. Plans to build frontend with HTML and SASS, and convert it into a Pug template.

## Slugify

A URL slug is a part that comes at the very end of a URL and is the exact address of a specific page on your website. For example - in <https://slugify.online/campaign-url-builder> URL, "campaign-url-builder" is a slug. Composing a short but descriptive slug for a URL of the web page can positively affect your page's SEO.
[For more information](https://github.com/simov/slugify)

## Validators

A library of string validators and sanitizers.

[For more information](<#[github.com/validatorjs/validator.js](https://github.com/validatorjs/validator.js)>)

## Bcrypt

A library to help you hash passwords.

You can read about [bcrypt in Wikipedia](https://en.wikipedia.org/wiki/Bcrypt) as well as in the following article: [How To Safely Store A Password](http://codahale.com/how-to-safely-store-a-password/)

[For more information](https://github.com/kelektiv/node.bcrypt.js)

## Crypto

JavaScript library of crypto standards.

[For more information](http://github.com/brix/crypto-js)

## Nodemailer

Send e-mails from Node.js – easy as cake! 🍰✉️

[For more information](https://nodemailer.com/about/)

## HTMLtoText

Advanced converter that parses HTML and returns beautiful text.

[For more information](https://github.com/html-to-text/node-html-to-text)

## Pug

Full documentation is at [pugjs.org](https://pugjs.org/)

Pug is a high performance template engine heavily influenced by [Haml](http://haml.info/) and implemented with JavaScript for [Node.js](http://nodejs.org/) and browsers. For bug reports, feature requests and questions, [open an issue](https://github.com/pugjs/pug/issues/new). For discussion join the [chat room](https://gitter.im/pugjs/pug).

You can test drive Pug online [here](https://pugjs.org/).

## Express

Fast, unopinionated, minimalist web framework for [node](http://nodejs.org/).

[For more information](https://expressjs.com)

## Morgan

HTTP request logger middleware for node.js

[For more information](https://github.com/expressjs/morgan)

## Express-rate-limit

Basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.

Plays nice with [express-slow-down](https://www.npmjs.com/package/express-slow-down).

[For more information](https://github.com/nfriedly/express-rate-limit)

## Helmet

Helmet helps you secure your Express apps by setting various HTTP headers. _It's not a silver bullet_, but it can help!

[For more information](https://github.com/helmetjs/helmet)

## Express-Mongo-Sanitize

Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection.

[For more information](https://github.com/fiznool/express-mongo-sanitize)

## Hyperparameters-pollution

[Express](http://expressjs.com/) middleware to **protect against HTTP Parameter Pollution attacks**

[For more information](https://github.com/analog-nico/hpp)

## XSS

Node.js Connect middleware to sanitize user input coming from POST body, GET queries, and url params. Works with [Express](http://expressjs.com/), [Restify](http://restify.com/), or any other [Connect](https://github.com/senchalabs/connect) app.

[For more information](https://github.com/jsonmaur/xss-clean)

## Path

The `path` module provides utilities for working with file and directory paths.
[Documentation](http://nodejs.org/docs/latest/api/path.html)

## Cookie-parser

Parse `Cookie` header and populate `req.cookies` with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a `secret` string, which assigns `req.secret` so it may be used by other middleware.

[For more information](https://github.com/expressjs/cookie-parser)

## Dotenv

Dotenv is a zero-dependency module that loads environment variables from a `.env` file into [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env). Storing configuration in the environment separate from code is based on [The Twelve-Factor App](http://12factor.net/config) methodology.

[For more information](https://github.com/motdotla/dotenv)

## JsonWebToken

An implementation of [JSON Web Tokens](https://tools.ietf.org/html/rfc7519).

This was developed against `draft-ietf-oauth-json-web-token-08`. It makes use of [node-jws](https://github.com/brianloveswords/node-jws)

[For more information](https://github.com/auth0/node-jsonwebtoken)

## Util

This implements the Node.js [`util`](https://nodejs.org/docs/latest-v8.x/api/util.html) module for environments that do not have it, like browsers.

[For more information](https://github.com/browserify/node-util)

## Stripe

The Stripe Node library provides convenient access to the Stripe API from applications written in server-side JavaScript.

For collecting customer and payment information in the browser, use [Stripe.js](https://stripe.com/docs/js).

See the [`stripe-node` API docs](https://stripe.com/docs/api?lang=node) for Node.js.

See [video demonstrations](https://www.youtube.com/playlist?list=PLy1nL-pvL2M5xNIuNapwmABwEy2uifAlY) covering how to use the library.

## Multer

Multer is a node.js middleware for handling `multipart/form-data`, which is primarily used for uploading files. It is written on top of [busboy](https://github.com/mscdex/busboy) for maximum efficiency.

**NOTE**: Multer will not process any form which is not multipart (`multipart/form-data`).

[For more information](https://github.com/expressjs/multer)

## Sharp

The typical use case for this high speed Node.js module is to convert large images in common formats to smaller, web-friendly JPEG, PNG, WebP and AVIF images of varying dimensions.

Resizing an image is typically 4x-5x faster than using the quickest ImageMagick and GraphicsMagick settings due to its use of [libvips](https://github.com/libvips/libvips).

Colour spaces, embedded ICC profiles and alpha transparency channels are all handled correctly. Lanczos resampling ensures quality is not sacrificed for speed.

As well as image resizing, operations such as rotation, extraction, compositing and gamma correction are available.

Most modern macOS, Windows and Linux systems running Node.js v10+ do not require any additional install or runtime dependencies.

Visit [sharp.pixelplumbing.com](https://sharp.pixelplumbing.com/) for complete [installation instructions](https://sharp.pixelplumbing.com/install), [API documentation](https://sharp.pixelplumbing.com/api-constructor), [benchmark tests](https://sharp.pixelplumbing.com/performance) and [changelog](https://sharp.pixelplumbing.com/changelog).

## Axios

Promise based HTTP client for the browser and node.js

[For more information](https://github.com/axios/axios)

## Mapbox

A [node.js](https://nodejs.org/) and browser JavaScript client to Mapbox services.

[For more information](https://github.com/mapbox/mapbox-sdk-js)
