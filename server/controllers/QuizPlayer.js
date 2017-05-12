const models = require('../models');
const QuizController = require('./Quiz');

const Quiz = models.Quiz;

const onError = (response) => (error) => {
  console.log(error);
  return response.status(400).json({ error: 'An error occurred' });
};

// Select quiz then redirect to quiz player
const quizPlayerPage = (request, response) =>
  Quiz.QuizModel.findByPublicId(request.query.quiz)
    .then(QuizController.selectQuiz(request))
    .then(() => response.render('quizPlayer', { csrfToken: request.csrfToken() }))
    .catch(onError(response));

module.exports = {
  quizPlayerPage,
};
