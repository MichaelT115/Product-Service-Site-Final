const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let HistoryModel = {};
let HistoryEntryModel = {};

// History schema entry
const HistoryEntrySchema = new mongoose.Schema({
  // The quiz done in this attempt
  quiz: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Quiz',
  },

  // The score received
  score: {
    type: Number,
  },

  // Date the attempt was made
  createdDate: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

// History schema
const HistorySchema = new mongoose.Schema({
  // The ID of the owner of this account.
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  // Entries into the history of this account
  entries: [HistoryEntrySchema],

  // Date the history was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});


HistorySchema.statics = {
  // Extracts info to be sent to the client (excludes _ids)
  getInfo: (doc) => ({
    owner: doc.owner.username,
    entries: doc.entries.map(entry => ({
      score: entry.score,
      quiz: entry.quiz.title,
      date: entry.createdDate,
    })),
  }),

  // Finds all the histories
  findAll: () =>
    HistoryModel
      .find({})
      .exec(),

  // Find history of a specific account
  find: (accountId) =>
    HistoryModel
      .findOne({ owner: accountId })
      .populate('owner', 'username')
      .populate('entries.quiz', 'title')
      .exec(),

  // Adds entry into history
  // Creates history doc if none exists for account.
  add: (quizId, account, score) =>
    HistoryModel
      .findOne({ owner: account })
      .exec()
      .then((_doc) => {
        // Create new history if none exist
        const doc = _doc || new HistoryModel({ owner: account });

        // Create then add new entry
        const entry = new HistoryEntryModel();
        entry.quiz = quizId;
        entry.score = score;
        doc.entries.push(entry);

        // Save updated/created history
        return doc.save();
      }),

  // Delete history document by account Id
  deleteByAccountId: (accountId) =>
    HistoryModel
      .remove({ account: accountId })
      .exec(),
};


HistoryModel = mongoose.model('History', HistorySchema);
HistoryEntryModel = mongoose.model('HistoryEntry', HistoryEntrySchema);

module.exports.HistoryModel = HistoryModel;
module.exports.HistorySchema = HistorySchema;

module.exports.HistoryEntryModel = HistoryEntryModel;
module.exports.HistoryEntrySchema = HistoryEntrySchema;
