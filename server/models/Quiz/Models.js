const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const QuizSchema = require('./QuizSchema').QuizSchema;
const Questions = require('./QuestionSchemas');
const QUESTION_TYPES = Questions.TYPES;
const QuestionSchemas = Questions.Schemas;

let QuizModel = {};
let QuestionModels = {};

// Convert to id object
const convertId = mongoose.Types.ObjectId;

// Converts quiz to API usable object.
QuizSchema.statics.toAPI = (doc) => ({
  _id: doc._id,
  publicId: doc.publicId,
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

// Get all quiz ids
QuizSchema.statics.findAllIds = () =>
  QuizModel
    .find({})
    .select('_id')
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


QuestionSchemas.Base.QuestionSchema.statics = {
  // General Question statics
  findAll: (quizId) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((doc) => doc.questions),
  // General Question statics
  findByIndex: (quizId, questionIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((doc) => doc.questions[questionIndex]),
  add: (quizId, question) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions.push(question);
        return doc.save();
      }),
  update: (quizId, questionIndex, _question) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = _question;
        const currentQuestion = doc.questions[questionIndex];

        question.title = currentQuestion.title;
        question.description = currentQuestion.description;

        doc.questions.splice(questionIndex, 1, question);
        return doc.save();
      }),
  updateTitle: (quizId, questionIndex, title) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        console.dir(title);
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
        console.dir(content);
        return doc.save();
      }),
  updateReward: (quizId, questionIndex, reward) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].reward = reward;
        return doc.save();
      }),
  updatePenalty: (quizId, questionIndex, penalty) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].penalty = penalty;
        return doc.save();
      }),

  delete: (quizId, questionIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions.splice(questionIndex, 1);
        return doc.save();
      }),
};

QuestionSchemas.MultipleChoice.MultipleChoiceSchema.statics = {
  updateCorrectAnswer: (quizId, questionIndex, answerIndex, isCorrect) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = doc.questions[questionIndex];

        if (question.correctAnswerIndex === JSON.parse(answerIndex) && !JSON.parse(isCorrect)) {
          question.correctAnswerIndex = 0;
        } else if (isCorrect) {
          question.correctAnswerIndex = answerIndex;
        }

        return doc.save();
      }),
};

QuestionSchemas.MultipleChoice.Answer.AnswerSchema.statics = {
  findAll: (quizId, questionIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((doc) => doc.questions[questionIndex].answers),

  add: (quizId, questionIndex, answer) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].answers.push(answer);
        return doc.save();
      }),

  update: (quizId, questionIndex, answerIndex, answer) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = doc.questions[questionIndex];
        question.answers.splice(answerIndex, 1, answer);
        return doc.save();
      }),

  updateContent: (quizId, questionIndex, answerIndex, content) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = doc.questions[questionIndex];

        question.answers[answerIndex].content = content;
        return doc.save();
      }),

  delete: (quizId, questionIndex, answerIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = doc.questions[questionIndex];

        if (question.answers.length === 1) {
          question.answers[0] = new QuestionModels.MultipleChoice.AnswerModel();
          question.correctAnswerIndex = 0;
          return doc.save();
        }

        question.answers.splice(answerIndex, 1);
        if (question.correctAnswerIndex >= answerIndex) {
          question.correctAnswerIndex -= 1;
        }

        return doc.save();
      }),
};

QuestionSchemas.TrueFalse.TrueFalseSchema.statics = {
  updateAnswerIsTrue: (quizId, questionIndex, isTrue) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].isTrue = isTrue;
        return doc.save();
      }),
};

QuestionSchemas.Numeric.NumericSchema.statics = {
  updateAnswer: (quizId, questionIndex, answer) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].answer = answer;
        return doc.save();
      }),
  updateError: (quizId, questionIndex, error) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].error = error;
        return doc.save();
      }),
};

QuestionSchemas.Text.TextSchema.statics = {
  updateAnswer: (quizId, questionIndex, answerText) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].answerText = answerText;
        return doc.save();
      }),
};

// Models
QuizModel = mongoose.model('Quiz', QuizSchema);

const questionsPath = QuizSchema.path('questions');
QuestionModels = {
  Base: mongoose.model(QUESTION_TYPES.BASE, QuestionSchemas.Base.QuestionSchema),

  MultipleChoice: questionsPath
    .discriminator(
    QUESTION_TYPES.MULTIPLE_CHOICE,
    QuestionSchemas.MultipleChoice.MultipleChoiceSchema
    ),

  TrueFalse: questionsPath
    .discriminator(
    QUESTION_TYPES.TRUE_FALSE,
    QuestionSchemas.TrueFalse.TrueFalseSchema
    ),

  Numeric: questionsPath
    .discriminator(
    QUESTION_TYPES.NUMERIC,
    QuestionSchemas.Numeric.NumericSchema
    ),

  Text: questionsPath
    .discriminator(
    QUESTION_TYPES.TEXT,
    QuestionSchemas.Text.TextSchema
    ),
};

QuestionModels.MultipleChoice.AnswerModel =
  mongoose.model('Answer', QuestionSchemas.MultipleChoice.Answer.AnswerSchema);

module.exports.QuizModel = QuizModel;
module.exports.QuestionModels = QuestionModels;
module.exports.QUESTION_TYPES = QUESTION_TYPES;
