const models = require('../models');
const QuizController = require('./Quiz');

const LeaderBoardModel = models.Leaderboard.LeaderboardModel;
const Quiz = models.Quiz;

// Handles when the leaderboard search is errors out.
const onError = (response) => (error) => {
  console.log(error);
  return response.status(400).json({ error: 'An error occurred' });
};

// Select quiz then redirect to leaderboard
const leaderboardPage = (request, response) =>
  Quiz.QuizModel.findByPublicId(request.query.quiz)
    .then(QuizController.selectQuiz(request))
    .then(() => response.render('leaderboard', { csrfToken: request.csrfToken() }))
    .catch(onError(response));

// redirect to leaderboard
const redirectLeaderboard = (request, response) =>
  Quiz.QuizModel.findByPublicId(request.query.quiz)
    .then(() => response.json({
      redirect: `/leaderboard?quiz=${request.query.quiz}`,
    }))
    .catch(onError(response));

// Get all the leaderboards
const getLeaderboards = (request, response) =>
  LeaderBoardModel
    .findAll()
    .then((leaderboards) => response.json({ leaderboards }))
    .catch(onError(response));

// Get leaderboard by quiz id
const getLeaderboard = (request, response) =>
  LeaderBoardModel
    .find(request.session.quiz._id)
    .then((leaderboard) => response.json(LeaderBoardModel.getInfo(leaderboard)))
    .catch(onError(response));

// Add leaderboard entry
const addLeaderBoardEntry = (request, response) =>
  LeaderBoardModel
    .add(request.session.quiz._id, request.session.account._id, request.body.score)
    .then((leaderboard) => response.json(LeaderBoardModel.getInfo(leaderboard)))
    .catch(onError(response));

// Delete leaderboard
const deleteLeaderboard = (request, response) =>
  LeaderBoardModel
    .deleteByQuizId(request.session.quiz._id)
    .then((leaderboard) => response.json({ leaderboard }))
    .catch(onError(response));

module.exports = {
  leaderboardPage,
  redirectLeaderboard,

  getLeaderboards,
  getLeaderboard,

  addLeaderBoardEntry,

  deleteLeaderboard,
};
