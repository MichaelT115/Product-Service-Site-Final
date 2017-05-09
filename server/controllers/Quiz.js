const models = require('../models');

const Quiz = models.Quiz;

// Get all the quizzes in the database
const getQuizzes = (request, response) => {
  // const req = request;
  const res = response;

  return Quiz.QuizModel.findAll()
    .then(
    (quizzes) => res.json({ quizzes }),
    (error) => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    );
};

// Get quiz by quiz id
const getQuiz = (request, response) => {
  const req = request;
  const res = response;
  console.dir(req.session);

  return Quiz.QuizModel.findByQuizId(req.session.quiz._id)
    .then(
    (quiz) => res.json({ quiz }),
    (error) => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    );
};

// Select quiz then redirect to quiz player
const playQuiz = (request, response) => {
  const req = request;
  const res = response;

  return Quiz.QuizModel.findByQuizId(req.body.quizId)
    .then(
    (quiz) => {
      req.session.quiz = Quiz.QuizModel.toAPI(quiz);
      return res.json({ redirect: '/quizPlayer' });
    },
    (error) => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    );
};

// Select quiz then redirect to quizbuilder
const editQuiz = (request, response) => {
  const req = request;
  const res = response;

  return Quiz.QuizModel.findByQuizId(req.body.quizId)
    .then(
    (quiz) => {
      req.session.quiz = Quiz.QuizModel.toAPI(quiz);
      return res.json({ redirect: '/quizBuilder' });
    },
    (error) => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    );
};

// Delete quiz
const deleteQuiz = (request, response) => {
  const req = request;
  const res = response;

  // Delete related questions and answers
  models.Question.QuestionModel.findQuestionIdsByQuizId(req.body.quizId)
    .then((questionIds) => {
      console.dir(questionIds);
      return questionIds.forEach((questionId) => {
        models.Answer.AnswerModel.deleteByQuestionId(questionId);
      }, this);
    })
    .then(() => models.Question.QuestionModel.deleteByQuizId(req.body.quizId));


  return Quiz.QuizModel.deleteById(req.body.quizId)
    .then(
    () => res.json({ redirect: '/main' }),
    (error) => {
      console.log(error);
      return res.status(400).json({ error: 'An error occurred' });
    }
    );
};

module.exports = {
  getQuizzes,
  getQuiz,
  playQuiz,
  editQuiz,
  deleteQuiz,
};
