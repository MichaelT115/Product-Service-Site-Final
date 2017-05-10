const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let HistoryModel = {};
let HistoryEntryModel = {};

const HistoryEntrySchema = new mongoose.Schema({
  // Human-readable label for the account
  quiz: {
    type: String,
    required: true,
  },

  score: {
    type: Number,
  },

  // Date the account was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Account schema
const HistorySchema = new mongoose.Schema({
  // Human-readable label for the account
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  entries: [HistoryEntrySchema],

  // Date the account was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});


HistoryModel = mongoose.model('History', HistorySchema);
HistoryEntryModel = mongoose.model('HistoryEntry', HistoryEntrySchema);

module.exports.HistoryModel = HistoryModel;
module.exports.HistorySchema = HistorySchema;

module.exports.HistoryEntryModel = HistoryEntryModel;
module.exports.HistoryEntrySchema = HistoryEntrySchema;
