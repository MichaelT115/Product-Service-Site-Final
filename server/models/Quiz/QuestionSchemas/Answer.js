const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
const shortid = require('shortid');

// Trims the content string
const setContent = (content) => _.escape(content).trim();

// Defines answer schema
const AnswerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: shortid.generate,
    },

    // The content of the answer
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
