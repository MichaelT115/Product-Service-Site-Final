const models = require('../models');

const Quiz = models.Quiz;

// Handles when the quiz search is errors out.
const onError = (response) => (error) => {
  console.log(error);
  return response.status(400).json({ error: 'An error occurred' });
};

// Add quiz to the session
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

const getQuizzesInfo = (request, response) =>
  Quiz.QuizModel.findAll()
    .then((quizzes) => {
      // Get quiz info
      const quizzesInfo = quizzes.map((quiz) => {
        const quizInfo = Quiz.QuizModel.getInfo(quiz);

        // Add in field telling client if the current account is the creator
        quizInfo.isCreation = quiz.creator._id.equals(request.session.account._id);
        return quizInfo;
      });

      // Return Quizzes
      return response.json(quizzesInfo);
    })
    .catch(onError(response));

// Select quiz then redirect to quiz player
const playQuiz = (request, response) =>
  Quiz.QuizModel.findByPublicId(request.query.quiz)
    .then(() => response.json({ redirect: `/quizPlayer?quiz=${request.query.quiz}` }))
    .catch(onError(response));

// Select quiz then redirect to quizBuilder
const editQuiz = (request, response) =>
  Quiz.QuizModel.findByPublicId(request.query.quiz)
    .then(() => response.json({
      redirect: `/quizBuilder?quiz=${request.query.quiz}`,
    }))
    .catch(onError(response));

// Delete quiz
const deleteQuiz = (request, response) =>
  Quiz.QuizModel.deleteByPublicId(request.body.publicId)
    .then(() => response.json({ redirect: '/main' }))
    .catch(onError(response));

module.exports = {
  getQuizzes,
  getQuiz,

  getQuizzesInfo,
  getQuizInfo,

  playQuiz,
  editQuiz,
  deleteQuiz,

  selectQuiz,
};
