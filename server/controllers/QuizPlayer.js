// const models = require('../models');

// const Quiz = models.Quiz;

// Get quiz player page
const quizPlayerPage = (req, res) => res.render('quizPlayer', { csrfToken: req.csrfToken() });

module.exports = {
  quizPlayerPage,
};
