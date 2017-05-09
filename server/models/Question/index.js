const Base = require('./Question.js');
const MultipleChoice = require('./QuestionMultipleChoice.js');
const TrueFalse = require('./QuestionTrueFalse.js');
const Numeric = require('./QuestionNumeric.js');
const Text = require('./QuestionText.js');


// Types of questions ENUM
module.exports.TYPES = require('./QuestionTypes.js');

module.exports.Models = {
  Base,
  MultipleChoice,
  TrueFalse,
  Numeric,
  Text,
};
