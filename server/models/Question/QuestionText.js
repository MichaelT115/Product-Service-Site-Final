const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

const setAnswerText = (text) => _.escape(text).trim();

const TextSchema = new mongoose.Schema(
  {
    // The text answer to the question
    answerText: {
      type: String,
      set: setAnswerText,
    },
  },
  {
    _id: false,
  }
);

module.exports.TextSchema = TextSchema;
