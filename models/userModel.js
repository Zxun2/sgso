const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

////////////////////////
// userSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minLength: [5, 'A name must have at least 5 characters'],
    maxLength: [20, 'A name can have at most 10 characters'],
    required: [true, 'Please tell us your name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Password must have at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // ONLY WORKS ON CREATE AND SAVE!!! 💥💥💥
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

////////////////////////
// HASHING PASSWORDS - DOCUMENT MIDDLEWARE (PRE HOOK)
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified a.k.a changed/created
  if (!this.isModified('password')) return next();

  // Hash th password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Finally delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

////////////////////////
// Checks if the password has been modified. If so, update field.
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  // This field is first created when the user signs up for the first time!
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

/////////////////////////////////////////////////
// REMOVES ALL NON-ACTIVE ACCOUNTS FROM QUERY
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

/////////////////////////////////////////////////
// Instance - Methods accessible by all documents
// Unable to access this.password since select is set to false in schema
// Hence the need to pass in userPassword
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/////////////////////////////////////////////////
// cHECK IF PASSWORD FIELD IS CHANGED AFTER LOGGING IN
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // JWT is issue on login. If true, means user change after logging in.
    return JWTTimestamp < changedTimestamp;
  }
  // False means not changed.
  return false;
};

/////////////////////////////////////////////////
// CREATE PASSWORD RESET TOKEN (LESS SECURE)
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // SET PASSWORDRESETTOKEN FIELD
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // TOKEN EXPIRES IN 10MINS
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
