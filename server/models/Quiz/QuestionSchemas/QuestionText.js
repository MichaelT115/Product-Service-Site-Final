const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

const setAnswerText = (text) => _.escape(text).trim();

const TextSchema = new mongoose.Schema(
  {
    // The text answer to the question
    answer: {
      type: String,
      set: setAnswerText,
      default: undefined,
    },
  },
  {
    _id: false,
  }
);

module.exports.TextSchema = TextSchema;
