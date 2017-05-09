const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

// Account schema
const AccountSchema = new mongoose.Schema({
  // Human-readable label for the account
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },

  // Used to create the final password
  salt: {
    type: Buffer,
    required: true,
  },

  // Code used to access account
  password: {
    type: String,
    required: true,
  },

  // Date the account was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts account to API usable object.
AccountSchema.statics.toAPI = doc => ({
  username: doc.username,
  _id: doc._id,
});

// Returns promise to validate the password.
const validatePassword = (doc, password) => new Promise((resolve, reject) => {
  // Salt and hash entered password
  crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (err) {
      reject(err);
    }

    // Compare input with actual password.
    resolve(hash.toString('hex') === doc.password);
  });
});

// Returns promise to find the account by the username
AccountSchema.statics.findByUsername = (name) => AccountModel.findOne({ username: name }).exec();

// Returns promise to generate hash
AccountSchema.statics.generateHash = (password) => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(saltLength);

  // Encrypt
  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (err) {
      reject(err);
    }
    resolve({
      salt,
      hash: hash.toString('hex'),
    });
  });
});

// Returns promise to authenticate password.
AccountSchema.statics.authenticate = (username, password) =>
  AccountModel.findByUsername(username)
    .catch((err) => Promise.reject(err))
    .then((doc) => {
      if (!doc) {
        return Promise.reject(Error('No User of that Username found.'));
      }
      return validatePassword(doc, password)
        .then(() => Promise.resolve(doc));
    });

// Updates username for existing account
AccountSchema.statics.updateUsername = (accountId, username) =>
  AccountModel
    .findById(accountId)
    .exec()
    .then((_doc) => {
      const doc = _doc;
      doc.username = username;
      return doc.save();
    });

// Updates password for existing account
AccountSchema.statics.updatePassword = (accountId, password, salt) =>
  AccountModel
    .findById(accountId)
    .exec()
    .then((_doc) => {
      const doc = _doc;
      doc.password = password;
      doc.salt = salt;
      return doc.save();
    });


AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
