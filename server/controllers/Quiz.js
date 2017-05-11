const models = require('../models');

const Quiz = models.Quiz;

const onError = (response) => (error) => {
  console.log(error);
  return response.status(400).json({ error: 'An error occurred' });
};

const selectQuiz = (_request) => (quiz) => {
  const request = _request;
  request.session.quiz = Quiz.QuizModel.toAPI(quiz);
};

// Get all the quizzes in the database
const getQuizzes = (request, response) =>
  Quiz.QuizModel.findAll()
    .then((quizzes) => response.json({ quizzes }))
    .catch(onError(response));

// Get quiz by quiz id
const getQuiz = (request, response) =>
  Quiz.QuizModel.findByQuizId(request.session.quiz._id)
    .then((quiz) => response.json({ quiz }))
    .catch(onError(response));

const getQuizInfo = (request, response) =>
  Quiz.QuizModel.findByQuizId(request.session.quiz._id)
    .then((quiz) => response.json(Quiz.QuizModel.getInfo(quiz)))
    .catch(onError(response));

// Select quiz then redirect to quiz player
const playQuiz = (request, response) =>
  Quiz.QuizModel.findByQuizId(request.body.quizId)
    .then(selectQuiz(request))
    .then(() => response.json({ redirect: '/quizPlayer' }))
    .catch(onError(response));

// Select quiz then redirect to quizBuilder
const editQuiz = (request, response) => Quiz.QuizModel.findByQuizId(request.body.quizId)
  .then(selectQuiz(request))
  .then(() => response.json({ redirect: '/quizBuilder' }))
  .catch(onError(response));

// Delete quiz
const deleteQuiz = (request, response) =>
  Quiz.QuizModel.deleteById(request.body.quizId)
    .then(() => response.json({ redirect: '/main' }))
    .catch(onError(response));

module.exports = {
  getQuizzes,
  getQuiz,
  getQuizInfo,
  playQuiz,
  editQuiz,
  deleteQuiz,
};
