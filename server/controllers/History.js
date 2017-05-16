const models = require('../models');
const HistoryModel = models.History.HistoryModel;

// Handles when the history search is errors out.
const onError = (response) => (error) => {
  console.log(error);
  return response.status(400).json({ error: 'An error occurred' });
};

// Get history page
const historyPage = (req, res) => res.render('history', { csrfToken: req.csrfToken() });

// Get all the leaderboards
const getHistories = (request, response) =>
  HistoryModel.findAll()
    .then((histories) => response.json({ histories }))
    .catch(onError(response));

// Get history by quiz id
const getHistory = (request, response) =>
  HistoryModel.find(request.session.account._id)
    .then((leaderboard) => response.json(HistoryModel.getInfo(leaderboard)))
    .catch(onError(response));


// Add history entry
const addHistoryEntry = (request, response) =>
  HistoryModel.add(request.session.quiz._id, request.session.account._id, request.body.score)
    .then((history) => response.json(HistoryModel.getInfo(history)))
    .catch(onError(response));

// Delete leaderboard
const deleteHistory = (request, response) =>
  HistoryModel
    .deleteByAccountId(request.session.quiz._id)
    .then((history) => response.json({ history }))
    .catch(onError(response));

module.exports = {
  historyPage,

  getHistories,
  getHistory,

  addHistoryEntry,

  deleteHistory,
};
