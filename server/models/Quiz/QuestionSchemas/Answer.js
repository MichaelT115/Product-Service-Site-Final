const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
const shortid = require('shortid');

const setContent = (name) => _.escape(name).trim();

// Defines answer schema
const AnswerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: shortid.generate,
    },

    // The content of the quiz
    content: {
      type: String,
      set: setContent,
    },

    // Date the answer was created
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
    discriminatorKey: 'type',
  });

module.exports.AnswerSchema = AnswerSchema;
