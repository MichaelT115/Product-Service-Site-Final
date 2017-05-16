const models = require('../models');
const QuizController = require('./Quiz');

const Quiz = models.Quiz;

// Handles when the quiz search is errors out.
const onError = (response) => (error) => {
  console.log(error);
  return response.status(400).json({ error: 'An error occurred' });
};

// Get Quiz Builder page
const quizBuilderPage = (request, response) =>
  Quiz.QuizModel.findByPublicId(request.query.quiz)
    .then(QuizController.selectQuiz(request))
    .then(() => response.render('quizBuilder', { csrfToken: request.csrfToken() }))
    .catch(onError(response));

// Create new quiz
const buildQuiz = (request, response) => {
  const req = request;
  const res = response;

  // Makes sure the quiz has a title
  if (!req.body.title) {
    return res.status(400).json({ error: 'Quiz title required.' });
  }

  // Create new quiz
  const quizData = {
    title: req.body.title,
    creator: req.session.account._id,
  };
  const newQuiz = new Quiz.QuizModel(quizData);

  // Save quiz
  const quizPromise = newQuiz.save();

  // On quiz saved to database, redirect to quiz builder
  quizPromise.then(() => {
    res.json({ redirect: `/quizBuilder?quiz=${newQuiz.publicId}` });
  });

  // Catch error
  quizPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  });

  return quizPromise;
};

// Update the name of the quiz in session
const updateQuizTitle = (request, response) => {
  const req = request;
  const res = response;

  return Quiz.QuizModel.updateTitle(req.session.quiz._id, req.body.title)
    .then(
    (quiz) => res.json({ quiz }),
    (error) => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    );
};

// Update the description fo the quiz in session
const updateQuizDescription = (request, response) => {
  const req = request;
  const res = response;

  return Quiz.QuizModel.updateDescription(req.session.quiz._id, req.body.description)
    .then(
    (quiz) => res.json({ quiz }),
    (error) => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    );
};

module.exports = {
  quizBuilderPage,
  buildQuiz,
  updateQuizTitle,
  updateQuizDescription,
};
