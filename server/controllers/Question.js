const models = require('../models');
const QuestionModels = models.Quiz.QuestionModels;


// Respond with question
const returnQuestion = (request, response) => (quiz) =>
  response.json({ question: quiz.questions[request.body.questionIndex] });

// Respond with question
const returnQuestions = (request, response) => (quiz) =>
  response.json({ questions: quiz.questions });

// Handles when the question search is errors out.
const onError = (response) => (error) => {
  console.log(error);
  return response.status(400).json({ error: 'An error occurred' });
};

// Get questions by quiz id
const getQuestions = (request, response) =>
  QuestionModels.Base.findAll(request.session.quiz._id)
    .then((questions) => response.json({ questions }))
    .catch(onError(response));

// Get question by quiz id and question index
const getQuestion = (request, response) =>
  QuestionModels.Base.findByIndex(request.session.quiz._id, request.query.question)
    .then((question) => response.json(QuestionModels.Base.getInfo(question)))
    .catch(onError(response));

// Check if multiple choice answer index is the correct answer
const getIsCorrectAnswer = (request, response) =>
  QuestionModels.Base.findByIndex(request.session.quiz._id, request.query.question)
    .then((question) =>
      response.json({
        isCorrect: question.correctAnswerIndex === JSON.parse(request.query.answer),
      }))
    .catch(onError(response));

// Check if the true/false answer given is correct
const getIsAnswerIsTrue = (request, response) =>
  QuestionModels.Base.findByIndex(request.session.quiz._id, request.query.question)
    .then((question) =>
      response.json({
        isCorrect: question.isTrue === JSON.parse(request.query.answer),
      }))
    .catch(onError(response));

// Check if the numerical answer given is correct
const getIsAnswerNumeric = (request, response) =>
  QuestionModels.Base.findByIndex(request.session.quiz._id, request.query.question)
    .then((question) =>
      response.json({
        isCorrect: Math.abs(question.answer - JSON.parse(request.query.answer)) <= question.error,
      }))
    .catch(onError(response));

// Check if the text answer given is correct
const getIsAnswerText = (request, response) =>
  QuestionModels.Base.findByIndex(request.session.quiz._id, request.query.question)
    .then((question) =>
      response.json({
        isCorrect: question.answer.toLowerCase() === request.query.answer.toLowerCase(),
      }))
    .catch(onError(response));

// Build question
const buildQuestion = (request, response) =>
  QuestionModels.Base.add(request.session.quiz._id, new QuestionModels.MultipleChoice())
    .then(returnQuestions(request, response))
    .catch(onError(response));

// Set the question type for this question
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

// Update correct answer index for multiple choice question
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

// Update boolean answer for true/false question
const updateAnswerIsTrue = (request, response) =>
  QuestionModels.TrueFalse
    .updateAnswerIsTrue(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.isTrue
    )
    .then(returnQuestion(request, response))
    .catch(onError(response));

// Update correct answer for numeric question
const updateAnswerNumeric = (request, response) =>
  QuestionModels.Numeric
    .updateAnswer(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.answer
    )
    .then(returnQuestion(request, response))
    .catch(onError(response));

// Update error range for numeric question
const updateAnswerError = (request, response) =>
  QuestionModels.Numeric
    .updateError(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.error
    )
    .then(returnQuestion(request, response))
    .catch(onError(response));

// Update text answer for text question
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

  getIsCorrectAnswer,
  getIsAnswerIsTrue,
  getIsAnswerNumeric,
  getIsAnswerText,

  deleteQuestion,
};
