const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
const shortid = require('shortid');

const Questions = require('./QuestionSchemas');
const QuestionSchemas = Questions.Schemas;

// Set name for quiz name
const setTitle = (name) => _.escape(name).trim();

// Quiz Schema
const QuizSchema = new mongoose.Schema({
  publicId: {
    type: String,
    default: shortid.generate,
  },

  // Title of quiz
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },

  // Description of quiz
  description: {
    type: String,
  },

  // Account ID of the creator of the quiz
  creator: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  // Date the quiz was created
  createdDate: {
    type: Date,
    default: Date.now,
  },

  // Questions in the quiz - Uses the base schema.
  questions: [QuestionSchemas.Base.QuestionSchema],
});

module.exports.QuizSchema = QuizSchema;
