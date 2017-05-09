const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const TrueFalseSchema = new mongoose.Schema(
  {
    // Index of the correct answer to this question
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
