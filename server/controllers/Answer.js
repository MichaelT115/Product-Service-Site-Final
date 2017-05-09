const models = require('../models');

// const Answer = models.Answer.AnswerModel;
const Quiz = models.Quiz;

// Create new answer
const buildAnswer = (request, response) => {
  const quiz = request.session.quiz;
  const questionIndex = Number(request.body.questionIndex);
  const newAnswer = new models.Quiz.AnswerModel();

  const quizPromise = Quiz.QuizModel.answers.addAnswer(quiz._id, questionIndex, newAnswer);

  quizPromise.then((doc) => response.json({ questions: doc.questions }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

// Update answer content
const updateAnswerContent = (request, response) => {
  const quizPromise =
    Quiz
      .QuizModel
      .answers
      .updateContent(
      request.session.quiz._id,
      request.body.questionIndex,
      request.body.answerIndex,
      request.body.content
      );

  quizPromise.then((question) => response.json({ question }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

// Delete answer
const deleteAnswer = (request, response) => {
  const quizPromise =
    Quiz
      .QuizModel
      .answers
      .deleteAnswer(request.session.quiz._id, request.body.questionIndex, request.body.answerIndex);

  quizPromise.then((question) => response.json({ question }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

module.exports = {
  buildAnswer,
  updateAnswerContent,
  deleteAnswer,
};
