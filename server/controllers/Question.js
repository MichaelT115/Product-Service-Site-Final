const models = require('../models');
const QuestionModels = models.Quiz.QuestionModels;


const returnQuestion = (request, response) => (quiz) =>
  response.json({ question: quiz.questions[request.body.questionIndex] });

const returnQuestions = (request, response) => (quiz) =>
  response.json({ questions: quiz.questions });

const onError = (response) => (error) => {
  console.log(error);
  return response.status(400).json({ error: 'An error occurred' });
};

// Get questions by quiz id
const getQuestions = (request, response) =>
  QuestionModels.Base.findAll(request.session.quiz._id)
    .then((questions) => response.json({ questions }))
    .catch(onError(response));

// Get question by question id
const getQuestion = (request, response) =>
  QuestionModels.Base.findByIndex(request.query.questionId)
    .then((question) => response.json({ question }))
    .catch(onError(response));

// Build question
const buildQuestion = (request, response) =>
  QuestionModels.Base.add(request.session.quiz._id, new QuestionModels.MultipleChoice())
    .then(returnQuestions(request, response))
    .catch(onError(response));

const setQuestionType = (request, response) =>
  QuestionModels.
    Base.
    update(
    request.session.quiz._id,
    request.body.questionIndex,
    new QuestionModels[request.body.type]()
    )
    .then(returnQuestion(request, response))
    .catch(onError(response));

// Update question title
const updateQuestionTitle = (request, response) =>
  QuestionModels.Base
    .updateTitle(request.session.quiz._id, request.body.index, request.body.title)
    .then(returnQuestion(request, response))
    .catch(onError(response));

// Update question content
const updateQuestionContent = (request, response) =>
  QuestionModels.Base
    .updateContent(request.session.quiz._id, request.body.index, request.body.content)
    .then(returnQuestion(request, response))
    .catch(onError(response));

// Update correct answer choice
const updateCorrectAnswer = (request, response) =>
  QuestionModels
    .MultipleChoice
    .updateCorrectAnswer(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.answerIndex,
    request.body.isCorrect
    )
    .then(returnQuestion(request, response))
    .catch(onError(response));

// Update correct answer choice
const updateAnswerIsTrue = (request, response) =>
  QuestionModels.TrueFalse
    .updateAnswerIsTrue(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.isTrue
    )
    .then(returnQuestion(request, response))
    .catch(onError(response));

const updateAnswerNumeric = (request, response) =>
  QuestionModels.Numeric
    .updateAnswer(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.answer
    )
    .then(returnQuestion(request, response))
    .catch(onError(response));

const updateAnswerError = (request, response) =>
  QuestionModels.Numeric
    .updateError(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.error
    )
    .then(returnQuestion(request, response))
    .catch(onError(response));

const updateAnswerText = (request, response) =>
  QuestionModels.Text
    .updateAnswer(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.answer
    )
    .then(returnQuestion(request, response))
    .catch(onError(response));

// Delete question
const deleteQuestion = (request, response) =>
  QuestionModels.Base
    .delete(request.session.quiz._id, request.body.index)
    .then((question) => response.json({ question }))
    .catch(onError(response));

module.exports = {
  getQuestions,
  getQuestion,

  buildQuestion,
  setQuestionType,

  updateQuestionTitle,
  updateQuestionContent,
  updateCorrectAnswer,
  updateAnswerIsTrue,
  updateAnswerNumeric,
  updateAnswerError,
  updateAnswerText,

  deleteQuestion,
};
