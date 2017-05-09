const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
const Question = require('./Question');
const QuestionTypes = Question.TYPES;
const QuestionModels = Question.Models;

let QuizModel = {};

// Convert to id object
const convertId = mongoose.Types.ObjectId;
// Set name for quiz name
const setTitle = (name) => _.escape(name).trim();

// Quiz Schema
const QuizSchema = new mongoose.Schema({
  // Title of quiz
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },

  // Description of quiz
  description: {
    type: String,
  },

  // Account ID of the creator of the quiz
  creator: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  // Date the quiz was created
  createdDate: {
    type: Date,
    default: Date.now,
  },

  // Questions in the quiz - Uses the base schema.
  questions: [QuestionModels.Base],
});

const questionsPath = QuizSchema.path('questions');
const quizQuestionsSchemas = {
  MultipleChoiceSchema: questionsPath
    .discriminator(
    QuestionTypes.MULTIPLE_CHOICE,
    QuestionModels.MultipleChoice
    ),

  TrueFalseSchema: questionsPath
    .discriminator(
    QuestionTypes.TRUE_FALSE,
    QuestionModels.TrueFalse
    ),

  NumericSchema: questionsPath
    .discriminator(
    QuestionTypes.NUMERIC,
    QuestionModels.Numeric
    ),

  TextSchema: questionsPath
    .discriminator(
    QuestionTypes.TEXT,
    QuestionModels.Text
    ),
};


// Converts quiz to API usable object.
QuizSchema.statics.toAPI = (doc) => ({
  _id: doc._id,
  title: doc.title,
  description: doc.description,
  creator: doc.creator,
  questions: doc.questions,
});

// Get all quizzes
QuizSchema.statics.findAll = () =>
  QuizModel
    .find({})
    .exec();

// Find quiz by quiz Id
QuizSchema.statics.findByQuizId = (quizId) =>
  QuizModel
    .findById(quizId)
    .exec();

// Find quiz by creator's account id
QuizSchema.statics.findByCreator = (creatorId) =>
  QuizModel
    .find({
      creator: convertId(creatorId),
    })
    .exec();

// Update title of quiz
QuizSchema.statics.updateTitle = (quizId, title) =>
  QuizModel
    .findById(quizId)
    .exec()
    .then((_doc) => {
      const doc = _doc;
      doc.title = title;
      return doc.save();
    });

// Update description of quiz
QuizSchema.statics.updateDescription = (quizId, description) =>
  QuizModel
    .findById(quizId)
    .exec()
    .then((_doc) => {
      const doc = _doc;
      doc.description = description;
      return doc.save();
    });

// Delete quiz by id
QuizSchema.statics.deleteById = (quizId) =>
  QuizModel
    .remove({ _id: quizId })
    .exec();

QuizSchema.statics.Questions = {
  // General Question statics

  MultipleChoice: {


    Answer: {

    },
  },

  TrueFalse: {

  },

  Numeric: {

  },

  QText: {

  },
};

// methods relating to questions
QuizSchema.statics.questions = {
  getQuestions: (quizId) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((doc) => doc.questions),

  addQuestion: (quizId, question) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions.push(question);
        return doc.save();
      }),

  updateQuestion: (quizId, questionIndex, question) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions.splice(questionIndex, 1, question);
        return doc.save();
      }),

  updateTitle: (quizId, questionIndex, title) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].title = title;
        return doc.save();
      }),

  updateContent: (quizId, questionIndex, content) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].content = content;
        return doc.save();
      }),

  updateCorrectAnswer: (quizId, questionIndex, answerIndex, isCorrect) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        if (isCorrect) {
          doc.questions[questionIndex].correctAnswerIndex = answerIndex;
        } else if (doc.questions[questionIndex].correctAnswerIndex === answerIndex) {
          doc.questions[questionIndex].correctAnswerIndex = -1;
        }
        return doc.save();
      }),

  updateAnswerIsTrue: (quizId, questionIndex, isTrue) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].isTrue = isTrue;
        return doc.save();
      }),

  updateAnswerMin: (quizId, questionIndex, min) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].min = min;
        return doc.save();
      }),

  updateAnswerMax: (quizId, questionIndex, max) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].max = max;
        return doc.save();
      }),

  updateAnswerText: (quizId, questionIndex, answerText) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].answerText = answerText;
        return doc.save();
      }),

  deleteQuestion: (quizId, questionIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions.splice(questionIndex, 1);
        return doc.save();
      }),
};

QuizSchema.statics.answers = {
  getAnswers: (quizId, questionIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((doc) => doc.questions[questionIndex].answers),

  addAnswer: (quizId, questionIndex, answer) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        console.dir(doc.questions[questionIndex]._docs);
        doc.questions[questionIndex].correctAnswerIndex = -1;

        doc.questions[questionIndex].answers.push(answer);
        return doc.save();
      }),

  updateContent: (quizId, questionIndex, answerIndex, content) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = doc.questions[questionIndex];

        console.dir(questionIndex);

        question.answers[answerIndex].content = content;
        return doc.save();
      }),

  deleteAnswer: (quizId, questionIndex, answerIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = doc.questions[questionIndex];
        question.answers.splice(answerIndex, 1);

        if (question.correctAnswerIndex >= answerIndex) {
          question.correctAnswerIndex -= 1;
        }

        return doc.save();
      }),
};


QuizModel = mongoose.model('Quiz', QuizSchema);

module.exports.QuizModel = QuizModel;
module.exports.QuizSchema = QuizSchema;
module.exports.QuizQuestionsSchemas = quizQuestionsSchemas;
module.exports.AnswerModel = Question.MultipleChoice.Answer.AnswerModel;
