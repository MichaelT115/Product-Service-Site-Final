const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Answer = require('./Answer.js');

const MultipleChoiceSchema = new mongoose.Schema(
  {
    // Index of the correct answer to this question
    correctAnswerIndex: {
      type: Number,
    },

    // Possible answers for the question
    answers: [Answer.AnswerSchema],
  },
  {
    _id: false,
  }
);


module.exports.MultipleChoiceSchema = MultipleChoiceSchema;
module.exports.Answer = Answer;
