const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Convert string to ID
const convertId = mongoose.Types.ObjectId;

const AnswerModel = {};

// Defines answer schema
const AnswerSchema = new mongoose.Schema({
  // The content of the quiz
  content: {
    type: String,
  },

  // Date the answer was created
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts answer to API usable object.
AnswerSchema.statics.toAPI = (doc) => ({
  question: doc.question,
  content: doc.content,
});

// Find answer with answer id
AnswerSchema.statics.findByID = (answerId) =>
  AnswerModel
    .findOne({
      _id: convertId(answerId),
    })
    .exec();

// Find answers by question id
AnswerSchema.statics.findByQuestionId = (questionId) =>
  AnswerModel
    .find({
      questionId: convertId(questionId),
    })
    .exec();

// Find answer ids by question ids
AnswerSchema.statics.findAnswerIdsByQuestionId = (questionId) =>
  AnswerModel
    .find(
    {
      questionId: convertId(questionId),
    },
    '_id')
    .exec();

// Update content of answer
AnswerSchema.statics.updateContent = (answerId, content) =>
  AnswerModel
    .findById(answerId)
    .exec()
    .then((_doc) => {
      const doc = _doc;
      doc.content = content;
      return doc.save();
    });

// Delete answer by answer id
AnswerSchema.statics.deleteById = (answerId) =>
  AnswerModel
    .remove({ _id: answerId })
    .exec();

// Delete answers by question id
AnswerSchema.statics.deleteByQuestionId = (questionId) =>
  AnswerModel
    .remove({ questionId })
    .exec();


module.exports.AnswerSchema = AnswerSchema;
module.exports.AnswerModel = mongoose.model('Answer', AnswerSchema);
