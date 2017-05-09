const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const NumericSchema = new mongoose.Schema(
  {
    // Minimum accepted number for the answer - Answer if there is not a range
    answer: {
      type: Number,
      default: 0,
      required: true,
    },

    // Maximum accepted number for the answer.
    error: {
      type: Number,
    },
  },
  {
    _id: false,
  }
);

module.exports.NumericSchema = NumericSchema;
