const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let LeaderboardModel = {};
let LeaderboardEntryModel = {};

const LeaderboardEntrySchema = new mongoose.Schema({
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
const LeaderboardSchema = new mongoose.Schema({
  // Human-readable label for the account
  quiz: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Quiz',
  },

  entries: [LeaderboardEntrySchema],

  // Date the account was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});


LeaderboardModel = mongoose.model('Leaderboard', LeaderboardSchema);
LeaderboardEntryModel = mongoose.model('LeaderboardEntry', LeaderboardEntrySchema);

module.exports.LeaderboardModel = LeaderboardModel;
module.exports.LeaderboardSchema = LeaderboardSchema;

module.exports.LeaderboardEntryModel = LeaderboardEntryModel;
module.exports.LeaderboardEntrySchema = LeaderboardEntrySchema;
