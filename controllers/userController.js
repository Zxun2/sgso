const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Saving images directly to diskStorage
//- removed as user may upload too large of an image
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Images are saved to this directory
//     cb(null, 'public/img/users');
//   },
//   // Renaming valid images' name
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

// Upload images
// Saving images to memory storage instead (creates a buffer)
const multerStorage = multer.memoryStorage();
// Ensure filetype is jpeg
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image!', 400), false);
  }
};

const upload = multer({
  // Storage and filter
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Uploads photo to memory
exports.uploadPhoto = upload.single('photo');

// Middleware to resize uploaded photo
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// Helper function for UpdateMe Function
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Update Me fields
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Filter out fields that are not allowed to be updated here
  const filteredBody = filterObj(req.body, 'email', 'name');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user documents - cannot use SAVE here since it will try to validate against the schema and tries to rehash the password
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  console.log(req.params.id);
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  // Switch user's status to inactive but retains user's data
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead!',
  });
};

// CRUD OPERATIONS
exports.getAllUsers = factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);
