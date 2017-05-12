const controllers = require('./controllers');
const mid = require('./middleware');

// Routes URLs
const router = (app) => {
  // --- Account Routes --- //
  // Get crsf token
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  // Attempt to login into app
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  // Sign up for an account
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  // Log out of app
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  // Get the current account info from the session
  app.get('/getCurrentAccount', mid.requiresSecure, mid.requiresLogin,
    controllers.Account.getCurrentUser);
  // Update the current account's username
  app.put('/updateUsername', mid.requiresSecure, mid.requiresLogin,
    controllers.Account.updateUsername);
  // Update the current account's password
  app.put('/updatePassword', mid.requiresSecure, mid.requiresLogin,
    controllers.Account.updatePassword);


  // --- Quiz --- //
  // Selects a quiz then redirects to the quiz player
  app.get('/playQuiz', mid.requiresSecure, controllers.Quiz.playQuiz);
  // Selects a quiz then redirects to the quiz editor
  app.get('/editQuiz', mid.requiresSecure, controllers.Quiz.editQuiz);
  // Deletes a quiz based of quiz id with associated questions and answers
  app.delete('/deleteQuiz', mid.requiresSecure, controllers.Quiz.deleteQuiz);
  // Gets a list of quizzes
  app.get('/getQuizzes', mid.requiresSecure, controllers.Quiz.getQuizzes);
  // Builds a new quiz and redirects to the quiz editor
  app.post('/buildQuiz', mid.requiresSecure, controllers.QuizBuilder.buildQuiz);
  // Get the currently selected quiz
  app.get('/getQuiz', mid.requiresSecure, mid.requiresQuizSelected, controllers.Quiz.getQuiz);
  app.get(
    '/getQuizInfo',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Quiz.getQuizInfo
  );
  app.get(
    '/getQuizzesInfo',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Quiz.getQuizzesInfo
  );
  // Update quiz title
  app.put(
    '/updateQuizTitle',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.QuizBuilder.updateQuizTitle
  );
  // Update quiz description
  app.put(
    '/updateQuizDescription',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.QuizBuilder.updateQuizDescription
  );

  // --- Questions --- //
  // Get the selected quizzes questions
  app.get(
    '/getQuestions',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.getQuestions
  );
  // Get a question based of question id.
  app.get(
    '/getQuestion',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.getQuestion
  );

  // // Check Answer
  app.get(
    '/getIsCorrectAnswer',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.getIsCorrectAnswer
  );
  app.get(
    '/getIsAnswerIsTrue',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.getIsAnswerIsTrue
  );
  app.get(
    '/getIsAnswerNumeric',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.getIsAnswerNumeric
  );
  app.get(
    '/getIsAnswerText',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.getIsAnswerText
  );

  // Create a new question
  app.post(
    '/buildQuestion',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.buildQuestion
  );
  // Update a question title based of question id
  app.put(
    '/updateQuestionTitle',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.updateQuestionTitle
  );
  // Update question content based of question id
  app.put(
    '/updateQuestionContent',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.updateQuestionContent
  );
  // Update question type
  app.put(
    '/setQuestionType',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.setQuestionType
  );
  // Update the question's correct answer based of question id and answer id
  app.put(
    '/updateQuestionCorrectAnswer',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.updateCorrectAnswer
  );
  // Update the question's correct answer based of question id and answer id
  app.put(
    '/updateAnswerIsTrue',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.updateAnswerIsTrue
  );

  app.put(
    '/updateAnswerNumeric',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.updateAnswerNumeric
  );
  app.put(
    '/updateAnswerError',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.updateAnswerError
  );
  app.put(
    '/updateAnswerText',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.updateAnswerText
  );

  // Delete question and associated answers.
  app.delete(
    '/deleteQuestion',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Question.deleteQuestion
  );

  // --- Answers --- //
  // Create new answer based off question id
  app.get(
    '/getAnswers',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Answer.getAnswers
  );
  app.post(
    '/buildAnswer',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Answer.buildAnswer
  );
  // Update answer based off question id
  app.put(
    '/updateAnswer',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Answer.updateAnswerContent
  );
  // Delete answer based of answer id
  app.delete(
    '/deleteAnswer',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.Answer.deleteAnswer
  );

  // --- Pages --- //
  // Login page
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  // Get login page
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  // Main app page
  app.get('/app', mid.requiresSecure, mid.requiresLogin, controllers.Account.mainPage);
  // Settings page
  app.get(
    '/userSettings',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Account.userSettingsPage
  );
  // Load the quiz builder view
  app.get(
    '/quizBuilder',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.QuizBuilder.quizBuilderPage
  );
  // Load the quiz player view
  app.get(
    '/quizPlayer',
    mid.requiresSecure,
    mid.requiresQuizSelected,
    controllers.QuizPlayer.quizPlayerPage
  );
  // Redirect non-existent pages to either the app page or the login page.
  app.get('*', mid.requiresSecure, mid.requiresLogin, controllers.Account.mainPage);
};

module.exports = router;
