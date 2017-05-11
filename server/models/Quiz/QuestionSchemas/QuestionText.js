const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const TextSchema = new mongoose.Schema(
  {
    // The text answer to the question
    answer: {
      type: String,
      default: undefined,
    },
  },
  {
    _id: false,
  }
);

module.exports.TextSchema = TextSchema;
