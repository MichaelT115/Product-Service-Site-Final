const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Defines answer schema
const AnswerSchema = new mongoose.Schema({
  // The content of the quiz
  content: {
    type: String,
  },

  // Date the answer was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports.AnswerSchema = AnswerSchema;
