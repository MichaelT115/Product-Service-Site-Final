const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// True/False question
const TrueFalseSchema = new mongoose.Schema(
  {
    // Whether the answer is true
    isTrue: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    _id: false,
  }
);

module.exports.TrueFalseSchema = TrueFalseSchema;
