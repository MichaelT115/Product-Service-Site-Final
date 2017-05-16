const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
const shortid = require('shortid');

const setTitle = (name) => _.escape(name).trim();

// Define question schema - other questions inherit from this.
const QuestionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: shortid.generate,
    },

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
    },

    // The reward for answering correctly
    reward: {
      type: Number,
    },

    // The penalty for answering incorrectly
    penalty: {
      type: Number,
    },

    // Date the question was created
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
    discriminatorKey: 'type',
  });

module.exports.QuestionSchema = QuestionSchema;
