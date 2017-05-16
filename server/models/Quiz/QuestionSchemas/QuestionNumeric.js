const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Numerical question
const NumericSchema = new mongoose.Schema(
  {
    // The answer to the question
    answer: {
      type: Number,
      default: 0,
      required: true,
    },

    // The distance from the answer that is within correct range.
    error: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

module.exports.NumericSchema = NumericSchema;
