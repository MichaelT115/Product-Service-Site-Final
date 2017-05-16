const models = require('../models');

const AnswerModel = models.Quiz.QuestionModels.MultipleChoice.AnswerModel;

// Return answer based off selected quiz, question ID, and answer ID.
const returnAnswer = (request, response) => (quiz) =>
  response.json({
    answer:
    quiz
      .questions[request.body.questionIndex]
      .answers[request.body.answerIndex],
  });

// Return answer based off selected quiz, question ID, and answer ID.
const returnAnswers = (request, response) => (answers) =>
  response.json(answers);

// Handles when the answer search is errors out.
const onError = (response) => (error) => {
  console.log(error);
  return response.status(400).json({ error: 'An error occurred' });
};

// Get answers to multiple choice question based off selected quiz and question ID
const getAnswers = (request, response) =>
  AnswerModel
    .findAll(request.session.quiz._id, request.query.question)
    .then(returnAnswers(request, response))
    .catch(onError(response));

// Create new answer
const buildAnswer = (request, response) =>
  AnswerModel
    .add(
    request.session.quiz._id,
    request.body.questionIndex,
    new AnswerModel()
    )
    .then(returnAnswers(request, response))
    .catch(onError(response));

// Update answer content
const updateAnswerContent = (request, response) =>
  AnswerModel
    .updateContent(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.answerIndex,
    request.body.content
    )
    .then(returnAnswer(request, response))
    .catch(onError(response));

// Delete answer
const deleteAnswer = (request, response) =>
  AnswerModel
    .delete(
    request.session.quiz._id,
    request.body.questionIndex,
    request.body.answerIndex
    )
    .then(returnAnswers(request, response))
    .catch(onError(response));

module.exports = {
  getAnswers,
  buildAnswer,
  updateAnswerContent,
  deleteAnswer,
};
