const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const convertId = mongoose.Types.ObjectId;

let LeaderboardModel = {};
let LeaderboardEntryModel = {};

// Leaderboard entry schema
const LeaderboardEntrySchema = new mongoose.Schema({
  // ID of the account that made this entry
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  // The score received by the attempt at the quiz
  score: {
    type: Number,
  },

  // Date the entry was made
  createdDate: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

// Leaderboard schema
const LeaderboardSchema = new mongoose.Schema({
  // The ID of the quiz this is the leaderboard for
  quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz',
  },

  // Entries to the leaderboard
  entries: [LeaderboardEntrySchema],

  // Date the account was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});


LeaderboardSchema.statics = {
  // Extracts info to be sent to the client (excludes _ids)
  getInfo: (doc) => ({
    quiz: {
      publicId: doc.quiz.publicId,
      title: doc.quiz.title,
      description: doc.quiz.description,
    },
    entries: doc.entries.map(entry => ({
      score: entry.score,
      account: entry.account.username,
    })),
  }),

  // Finds all the leaderboards
  findAll: () =>
    LeaderboardModel
      .find({})
      .exec(),

  // Finds the leaderboard for the quiz.
  find: (quiz) =>
    LeaderboardModel
      .findOne({ quiz })
      .populate('quiz', 'publicId title description')
      .populate('entries.account', 'username')
      .exec(),

  // Adds entry to the leaderboard for the quiz.
  // Creates leaderboard if one does not exist for the quiz/
  add: (quizId, account, score) =>
    LeaderboardModel
      .findOne({ quiz: convertId(quizId) })
      .exec()
      .then((_doc) => {
        // Create new leaderboard if none exist
        const doc = _doc || new LeaderboardModel({ quiz: convertId(quizId) });

        // Create and add entry
        const entry = new LeaderboardEntryModel();
        entry.account = account;
        entry.score = score;
        doc.entries.push(entry);

        // Save updated/created leaderboard
        return doc.save();
      }),

  // Delete leaderboard document by quiz Id
  deleteByQuizId: (quizId) =>
    LeaderboardModel
      .remove({ quiz: quizId })
      .exec(),
};


LeaderboardModel = mongoose.model('Leaderboard', LeaderboardSchema);
LeaderboardEntryModel = mongoose.model('LeaderboardEntry', LeaderboardEntrySchema);

module.exports.LeaderboardModel = LeaderboardModel;
module.exports.LeaderboardSchema = LeaderboardSchema;

module.exports.LeaderboardEntryModel = LeaderboardEntryModel;
module.exports.LeaderboardEntrySchema = LeaderboardEntrySchema;
