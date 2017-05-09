const models = require('../models');

const Question = models.QuestionSchemas;
const Quiz = models.Quiz;

// Get questions by quiz id
const getQuestions = (request, response) =>
  Quiz.QuizModel.questions.getQuestions(request.session.quiz._id)
    .then(
    (questions) => response.json({ questions }),
    (error) => {
      console.log(error);
      return response.status(400).json({ error: 'An error occurred' });
    }
    );

// Get question ids by quiz ids
const getQuestionIds = (request, response) => {
  const req = request;
  const res = response;

  return Question.QuestionModel.findQuestionIdsByQuizId(req.session.quiz._id)
    .then(
    (questionIds) => res.json({ questionIds }),
    (error) => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    );
};

// Get question by question id
const getQuestion = (request, response) => {
  const req = request;
  const res = response;

  console.dir(req.query);

  return Question.QuestionModel.findByID(req.query.questionId)
    .then(
    (question) => {
      console.dir(req.query);
      console.dir(question);
      return res.json({ question });
    },
    (error) => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    );
};

// Build question
const buildQuestion = (request, response) => {
  const newQuestion = new Quiz.QuizQuestionsSchemas.MultipleChoiceSchema();

  const quizPromise = Quiz.QuizModel.questions.addQuestion(request.session.quiz._id, newQuestion);

  quizPromise.then((quiz) => response.json({ questions: quiz.questions }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

const setQuestionType = (request, response) => {
  const quiz = request.session.quiz;
  const index = request.body.questionIndex;
  const type = request.body.type;
  let newQuestion = {};

  switch (type) {
    case 'TrueFalse':
      newQuestion = new Quiz.QuizQuestionsSchemas.TrueFalseSchema();
      break;
    case 'Numeric':
      newQuestion = new Quiz.QuizQuestionsSchemas.NumericSchema();
      break;
    case 'Text':
      newQuestion = new Quiz.QuizQuestionsSchemas.TextSchema();
      break;
    case 'MultipleChoice':
    default:
      newQuestion = new Quiz.QuizQuestionsSchemas.MultipleChoiceSchema();
      break;
  }


  const quizPromise = Quiz.QuizModel.questions.updateQuestion(quiz._id, index, newQuestion);

  quizPromise.then((question) => response.json({ question }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

// Update question title
const updateQuestionTitle = (request, response) => {
  const quizPromise =
    Quiz
      .QuizModel
      .questions
      .updateTitle(request.session.quiz._id, request.body.index, request.body.title);

  quizPromise.then((question) => response.json({ question }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

// Update question content
const updateQuestionContent = (request, response) => {
  const quizPromise =
    Quiz.
      QuizModel.
      questions.
      updateContent(request.session.quiz._id, request.body.index, request.body.content);

  quizPromise.then((question) => response.json({ question }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

// Update correct answer choice
const updateCorrectAnswer = (request, response) => {
  const quizPromise =
    Quiz.
      QuizModel.
      questions.
      updateCorrectAnswer(
      request.session.quiz._id,
      request.body.questionIndex,
      request.body.answerIndex,
      request.body.isCorrect
      );

  quizPromise.then((question) => response.json({ question }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

// Update correct answer choice
const updateAnswerIsTrue = (request, response) => {
  const quizPromise =
    Quiz.
      QuizModel.
      questions.
      updateAnswerIsTrue(
      request.session.quiz._id,
      request.body.questionIndex,
      request.body.isTrue
      );

  quizPromise.then((question) => response.json({ question }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

// Delete question
const deleteQuestion = (request, response) => {
  const quizPromise =
    Quiz.
      QuizModel.
      questions.
      deleteQuestion(request.session.quiz._id, request.body.index);

  quizPromise.then((question) => response.json({ question }));

  quizPromise.catch((err) => {
    console.log(err);
    return response.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

module.exports = {
  getQuestions,
  getQuestionIds,
  getQuestion,
  buildQuestion,
  setQuestionType,
  updateQuestionTitle,
  updateQuestionContent,
  updateCorrectAnswer,
  updateAnswerIsTrue,
  deleteQuestion,
};
