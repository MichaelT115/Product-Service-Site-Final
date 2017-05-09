const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');


const setTitle = (name) => _.escape(name).trim();

// Define question schema
const QuestionSchema = new mongoose.Schema(
  {
    // Title of question
    title: {
      type: String,
      trim: true,
      set: setTitle,
    },

    // Content of the question, includes actual question and context
    content: {
      type: String,
      trim: true,
      set: setTitle,
    },

    // Date the question was created
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    discriminatorKey: 'type',
  });

module.exports.QuestionSchema = QuestionSchema;
