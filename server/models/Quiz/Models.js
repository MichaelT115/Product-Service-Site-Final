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

//
// Statics
//

// Converts quiz to API usable object.
QuizSchema.statics.toAPI = (doc) => ({
  _id: doc._id,
  publicId: doc.publicId,
  title: doc.title,
  description: doc.description,
  creator: doc.creator,
  questions: doc.questions,
});

// Gets information on the quiz intended for client.
QuizSchema.statics.getInfo = (doc) => ({
  publicId: doc.publicId,
  title: doc.title,
  description: doc.description,
  creator: doc.creator.username,
  questionCount: doc.questions.length,
});

// Get all quizzes
QuizSchema.statics.findAll = () =>
  QuizModel
    .find({})
    .populate('creator', 'username')
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
    .populate('creator', 'username')
    .exec();

// Find quiz by public quiz Id
QuizSchema.statics.findByPublicId = (publicId) =>
  QuizModel
    .findOne({ publicId })
    .populate('creator', 'username')
    .exec();

// Find quiz by creator's account id
QuizSchema.statics.findByCreator = (creatorId) =>
  QuizModel
    .find({
      creator: convertId(creatorId),
    })
    .populate('creator', 'username')
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

// Delete quiz by publicId
QuizSchema.statics.deleteByPublicId = (publicId) =>
  QuizModel
    .remove({ publicId })
    .exec();


// Methods that apply to all questions
QuestionSchemas.Base.QuestionSchema.statics = {
  // Everything except the answer
  getInfo: (doc) => ({
    id: doc.id,
    type: doc.type,
    title: doc.title,
    content: doc.content,
    reward: doc.reward,
    penalty: doc.penalty,
  }),

  // Get all the questions
  findAll: (quizId) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((doc) => doc.questions),

  // Get question by index and quiz id
  findByIndex: (quizId, questionIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((doc) => doc.questions[questionIndex]),

  // Add question to quiz
  add: (quizId, question) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions.push(question);
        return doc.save();
      }),

  // Update question in quiz
  update: (quizId, questionIndex, _question) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = _question;
        const currentQuestion = doc.questions[questionIndex];

        // Updates new question info to match old
        question.title = currentQuestion.title;
        question.content = currentQuestion.content;

        // Replace old question with new question
        doc.questions.splice(questionIndex, 1, question);

        // Save quiz
        return doc.save();
      }),

  // Update the title of a question
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

  // Update the content of a question
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

  // Update the reward for answering a question
  updateReward: (quizId, questionIndex, reward) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].reward = reward;
        return doc.save();
      }),

  // Update the penalty for getting a question wrong
  updatePenalty: (quizId, questionIndex, penalty) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].penalty = penalty;
        return doc.save();
      }),

  // Delete question from quiz
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

// Methods relating to multiple choice question
QuestionSchemas.MultipleChoice.MultipleChoiceSchema.statics = {
  // Update the correct answer index of question
  updateCorrectAnswer: (quizId, questionIndex, answerIndex, isCorrect) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = doc.questions[questionIndex];

        // If the current correct answer is now false, make the correnct answer index 0
        if (question.correctAnswerIndex === JSON.parse(answerIndex) && !JSON.parse(isCorrect)) {
          question.correctAnswerIndex = 0;
        } else if (isCorrect) {
          // Set new correct answer
          question.correctAnswerIndex = answerIndex;
        }

        // Save quiz
        return doc.save();
      }),
};

// Methods relating to the multiple choice answers
QuestionSchemas.MultipleChoice.Answer.AnswerSchema.statics = {
  // Find all answers to a question in this quiz
  findAll: (quizId, questionIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((doc) => doc.questions[questionIndex].answers),

  // Add new multiple choice answer to question in quiz
  add: (quizId, questionIndex, answer) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].answers.push(answer);
        return doc.save();
      }),

  // Update multiple choice answer to question in quiz
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

  // Update the content of the multiple choice answer to question in quiz
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

  // Delete multiple choice answer to question in quiz
  delete: (quizId, questionIndex, answerIndex) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        const question = doc.questions[questionIndex];

        // Make sure we at least have an empty answer
        if (question.answers.length === 1) {
          question.answers[0] = new QuestionModels.MultipleChoice.AnswerModel();
          question.correctAnswerIndex = 0;
          return doc.save();
        }

        // Delete answer
        question.answers.splice(answerIndex, 1);
        if (question.correctAnswerIndex >= answerIndex) {
          // New correct answer index
          question.correctAnswerIndex -= 1;
        }

        // Make sure the correct answer index is never under zero
        if (question.correctAnswerIndex < 0) {
          question.correctAnswerIndex = 0;
        }

        // Save quiz
        return doc.save();
      }),
};

// Methods for True/False questions
QuestionSchemas.TrueFalse.TrueFalseSchema.statics = {
  // Update the answer to the question in quiz
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

// Methods for Numeric questions
QuestionSchemas.Numeric.NumericSchema.statics = {
  // Update the answer to the question in quiz
  updateAnswer: (quizId, questionIndex, answer) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        doc.questions[questionIndex].answer = answer;
        return doc.save();
      }),

  // Update the error range of question in quiz
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

// Methods for Text questions
QuestionSchemas.Text.TextSchema.statics = {
  // Update the answer to the question in quiz
  updateAnswer: (quizId, questionIndex, answer) =>
    QuizModel
      .findById(quizId)
      .exec()
      .then((_doc) => {
        const doc = _doc;
        console.dir(questionIndex);
        doc.questions[questionIndex].answer = answer;
        return doc.save();
      }),
};

//
// Models
//

// Make quiz model
QuizModel = mongoose.model('Quiz', QuizSchema);

// Make question models
const questionsPath = QuizSchema.path('questions');
QuestionModels = {
  // Make base question model
  Base: mongoose
    .model(
    QUESTION_TYPES.BASE,
    QuestionSchemas.Base.QuestionSchema
    ),

  // Make multiple choice question model which inherits from base question model
  MultipleChoice: questionsPath
    .discriminator(
    QUESTION_TYPES.MULTIPLE_CHOICE,
    QuestionSchemas.MultipleChoice.MultipleChoiceSchema
    ),

  // Make True/False choice question model which inherits from base question model
  TrueFalse: questionsPath
    .discriminator(
    QUESTION_TYPES.TRUE_FALSE,
    QuestionSchemas.TrueFalse.TrueFalseSchema
    ),

  // Make numeric choice question model which inherits from base question model
  Numeric: questionsPath
    .discriminator(
    QUESTION_TYPES.NUMERIC,
    QuestionSchemas.Numeric.NumericSchema
    ),

  // Make text question model which inherits from base question model
  Text: questionsPath
    .discriminator(
    QUESTION_TYPES.TEXT,
    QuestionSchemas.Text.TextSchema
    ),
};

// Make Answer model
QuestionModels.MultipleChoice.AnswerModel =
  mongoose.model('Answer', QuestionSchemas.MultipleChoice.Answer.AnswerSchema);

module.exports.QuizModel = QuizModel;
module.exports.QuestionModels = QuestionModels;
module.exports.QUESTION_TYPES = QUESTION_TYPES;
