'use strict';

// Setup the quiz builder page
var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(QuizInfoPanel, { csrf: csrf }), document.querySelector('#quizBuilder'));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken').then(function (result) {
    setup(result.csrfToken);
  });
};

// Get csrf and begin setup
$(document).ready(getToken);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds the list of answers to multiple choice question
var AnswerMultipleChoiceListPanel = function (_React$Component) {
  _inherits(AnswerMultipleChoiceListPanel, _React$Component);

  // Create initial data
  function AnswerMultipleChoiceListPanel() {
    _classCallCheck(this, AnswerMultipleChoiceListPanel);

    var _this = _possibleConstructorReturn(this, (AnswerMultipleChoiceListPanel.__proto__ || Object.getPrototypeOf(AnswerMultipleChoiceListPanel)).call(this));

    _this.addAnswer = _this.addAnswer.bind(_this);
    return _this;
  }

  // Add an answer to the question


  _createClass(AnswerMultipleChoiceListPanel, [{
    key: 'addAnswer',
    value: function addAnswer() {
      sendAjax('POST', '/buildAnswer', {
        _csrf: this.props.csrf,
        questionIndex: this.props.index
      }).then(this.props.onChange);
    }

    // Update if answer is correct

  }, {
    key: 'updateCorrectAnswer',
    value: function updateCorrectAnswer(answerIndex, isCorrect) {
      sendAjax("PUT", '/updateQuestionCorrectAnswer', {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        answerIndex: answerIndex,
        isCorrect: isCorrect
      }).then(this.props.onChange);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var question = this.props.question;
      var answers = question.answers || [];

      if (answers.length == 0) {
        this.addAnswer();
      }

      // Answer panels for each answer id
      var answerNodes = answers.map(function (answer, index) {
        // Renders the actual answer
        return React.createElement(AnswerMultipleChoicePanel, {
          key: answer.id,
          questionIndex: _this2.props.index,
          index: index,
          question: _this2.props.question,
          answer: answer,
          parent: _this2,
          onChange: _this2.props.onChange,
          csrf: _this2.props.csrf
        });
      });

      // Render answers
      return React.createElement(
        'div',
        null,
        answerNodes,
        React.createElement('input', {
          className: 'quizBuilderButton',
          type: 'button',
          onClick: this.addAnswer,
          value: 'Add Answer'
        })
      );
    }
  }]);

  return AnswerMultipleChoiceListPanel;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds a single answer to a multiple choice question
var AnswerMultipleChoicePanel = function (_React$Component) {
  _inherits(AnswerMultipleChoicePanel, _React$Component);

  // Create initial data
  function AnswerMultipleChoicePanel() {
    _classCallCheck(this, AnswerMultipleChoicePanel);

    var _this = _possibleConstructorReturn(this, (AnswerMultipleChoicePanel.__proto__ || Object.getPrototypeOf(AnswerMultipleChoicePanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.updateAnswer = _this.updateAnswer.bind(_this);
    _this.deleteAnswer = _this.deleteAnswer.bind(_this);
    return _this;
  }

  // Update this answer


  _createClass(AnswerMultipleChoicePanel, [{
    key: 'updateAnswer',
    value: function updateAnswer(content) {
      sendAjax("PUT", '/updateAnswer', {
        _csrf: this.props.csrf,
        questionIndex: this.props.questionIndex,
        answerIndex: this.props.index,
        content: content
      }).then(setMessageSaved);
    }

    // Delete answer from question

  }, {
    key: 'deleteAnswer',
    value: function deleteAnswer() {
      sendAjax('DELETE', '/deleteAnswer', {
        _csrf: this.props.csrf,
        questionIndex: this.props.questionIndex,
        answerIndex: this.props.index
      }).then(this.props.onChange);
    }

    // Render answer

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var answer = this.props.answer;
      var answerContentId = 'answerContent_a' + this.props.index + '_q' + this.props.questionIndex;

      // Updates the answer after the user has stopped typing for half a second.
      var answerUpdater = new DelayUpdateHandler(500, function () {
        _this2.updateAnswer($('#' + answerContentId).val());
      }, setMessageSaving);

      // Final render
      return React.createElement(
        'div',
        { className: 'answerPanel' },
        React.createElement('input', { type: 'button', className: 'quizBuilderButton',
          value:
          // Set the change correctness button icon
          this.props.question.correctAnswerIndex == this.props.index ? "✔" : "✘",
          onClick:
          // Change the answer correctness
          function onClick() {
            return _this2.props.parent.updateCorrectAnswer(_this2.props.index, !_this2.props.isCorrect);
          }
        }),
        React.createElement('input', { id: answerContentId, className: 'questionTitle', type: 'text', name: 'content',
          defaultValue: _.unescape(answer.content || ""),
          placeholder: 'Enter Answer',
          size: answer.content ? answer.content.length || 10 : 10,
          onChange: function onChange(e) {
            // Set size of info field
            e.target.size = e.target.value.length || 10;
            // Update answer
            answerUpdater.update();
          }
        }),
        React.createElement('input', { type: 'button', className: 'quizBuilderButton', value: 'Delete Answer',
          onClick: this.deleteAnswer
        })
      );
    }
  }]);

  return AnswerMultipleChoicePanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds an answer to a Numeric question
var AnswerNumericPanel = function (_React$Component) {
  _inherits(AnswerNumericPanel, _React$Component);

  function AnswerNumericPanel() {
    _classCallCheck(this, AnswerNumericPanel);

    var _this = _possibleConstructorReturn(this, (AnswerNumericPanel.__proto__ || Object.getPrototypeOf(AnswerNumericPanel)).call(this));

    _this.updateAnswerNumeric = _this.updateAnswerNumeric.bind(_this);
    _this.updateAnswerError = _this.updateAnswerError.bind(_this);
    return _this;
  }

  // Update this answer


  _createClass(AnswerNumericPanel, [{
    key: "updateAnswerNumeric",
    value: function updateAnswerNumeric(answer) {
      sendAjax("PUT", '/updateAnswerNumeric', {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        answer: answer
      }).then(this.props.onChange);
    }

    // Update this answer's error interval

  }, {
    key: "updateAnswerError",
    value: function updateAnswerError(error) {
      sendAjax("PUT", '/updateAnswerError', {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        error: error
      }).then(this.props.onChange);
    }

    // Render answer

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var question = this.props.question;
      return React.createElement(
        "div",
        null,
        React.createElement(
          "span",
          null,
          "Answer: "
        ),
        React.createElement("input", {
          className: "questionInput questionInputNumeric",
          type: "number",
          step: 0.1,
          defaultValue: question.answer,
          name: "quantity",
          onChange: function onChange(e) {
            setMessageSaving();
            _this2.updateAnswerNumeric(e.target.value);
          }
        }),
        React.createElement("br", null),
        React.createElement(
          "span",
          null,
          "Allowed Error: "
        ),
        React.createElement("input", {
          className: "questionInput questionInputNumeric",
          type: "number",
          min: 0,
          step: 0.1,
          defaultValue: question.error,
          name: "quantity",
          onChange: function onChange(e) {
            setMessageSaving();
            _this2.updateAnswerError(e.target.value);
          }
        })
      );
    }
  }]);

  return AnswerNumericPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds an answer to a Text question
var AnswerTextPanel = function (_React$Component) {
  _inherits(AnswerTextPanel, _React$Component);

  function AnswerTextPanel() {
    _classCallCheck(this, AnswerTextPanel);

    var _this = _possibleConstructorReturn(this, (AnswerTextPanel.__proto__ || Object.getPrototypeOf(AnswerTextPanel)).call(this));

    _this.updateAnswer = _this.updateAnswer.bind(_this);
    return _this;
  }

  // Update this answer


  _createClass(AnswerTextPanel, [{
    key: "updateAnswer",
    value: function updateAnswer(answer) {
      sendAjax("PUT", '/updateAnswerText', {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        answer: answer
      }).then(this.props.onChange);
    }

    // Render answer

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var question = this.props.question;
      var answerContentId = "answerContent_text_q" + this.props.index;

      // Updates the answer after the user has stopped typing for half a second.
      var answerUpdater = new DelayUpdateHandler(500, function () {
        _this2.updateAnswer($("#" + answerContentId).val());
      }, setMessageSaving);

      // Final render
      return React.createElement(
        "div",
        { className: "answerPanel" },
        React.createElement(AutoExpandTextField, {
          id: answerContentId,
          className: "questionInput",
          placeholder: "Type Answer Here",
          defaultValue: question.answer,
          onChange: answerUpdater.update
        })
      );
    }
  }]);

  return AnswerTextPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds an answer to a True/False question
var AnswerTrueFalsePanel = function (_React$Component) {
  _inherits(AnswerTrueFalsePanel, _React$Component);

  // Create initial data
  function AnswerTrueFalsePanel() {
    _classCallCheck(this, AnswerTrueFalsePanel);

    var _this = _possibleConstructorReturn(this, (AnswerTrueFalsePanel.__proto__ || Object.getPrototypeOf(AnswerTrueFalsePanel)).call(this));

    _this.updateAnswerIsTrue = _this.updateAnswerIsTrue.bind(_this);
    return _this;
  }

  // Update this answer


  _createClass(AnswerTrueFalsePanel, [{
    key: "updateAnswerIsTrue",
    value: function updateAnswerIsTrue(isTrue) {
      sendAjax("PUT", '/updateAnswerIsTrue', {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        isTrue: isTrue
      }).then(this.props.onChange);
    }

    // Render answer

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var question = this.props.question;
      return React.createElement("input", { type: "button", className: "quizBuilderButton",
        value:
        // Set the change correctness button icon
        question.isTrue ? "✔ TRUE" : "✘ FALSE",
        onClick: function onClick() {
          setMessageSaving();
          _this2.updateAnswerIsTrue(!question.isTrue);
        }
      });
    }
  }]);

  return AnswerTrueFalsePanel;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Handles the list of questions. Loads an array of question ids
var QuestionListPanel = function (_React$Component) {
  _inherits(QuestionListPanel, _React$Component);

  // Create initial data
  function QuestionListPanel() {
    _classCallCheck(this, QuestionListPanel);

    var _this = _possibleConstructorReturn(this, (QuestionListPanel.__proto__ || Object.getPrototypeOf(QuestionListPanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.loadQuestions = _this.loadQuestions.bind(_this);
    _this.addQuestion = _this.addQuestion.bind(_this);
    _this.deleteQuestion = _this.deleteQuestion.bind(_this);
    return _this;
  }

  _createClass(QuestionListPanel, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadQuestions();
    }

    // Loads the questions.

  }, {
    key: 'loadQuestions',
    value: function loadQuestions() {
      var _this2 = this;

      sendAjax('GET', '/getQuestions', { _csrf: this.props.csrf }).then(function (data) {
        _this2.setState({
          data: {
            questions: data.questions
          }
        });
      }).then(setMessageSaved);
    }

    // Add question to quiz

  }, {
    key: 'addQuestion',
    value: function addQuestion() {
      sendAjax('POST', '/buildQuestion', { _csrf: this.props.csrf }).then(this.loadQuestions);
    }

    // Delete question from quiz

  }, {
    key: 'deleteQuestion',
    value: function deleteQuestion(questionIndex) {
      var self = this;
      sendAjax('DELETE', '/deleteQuestion', { _csrf: this.props.csrf, index: questionIndex }).then(this.loadQuestions);
    }

    // Render the questions

  }, {
    key: 'render',
    value: function render() {
      var self = this;
      var questions = this.state.data.questions || [];

      // Check if question ids are loaded
      if (questions.length === 0) {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'h3',
            null,
            'No Questions Yet'
          ),
          React.createElement('input', { type: 'button', onClick: self.addQuestion.bind(self), value: 'Add Question' })
        );
      };

      // Create question nodes
      var questionNodes = questions.map(function (question, index) {
        // Render the question itself
        return React.createElement(QuestionPanel, { key: question.id, index: index, question: question, parent: self, csrf: self.props.csrf });
      });

      // Render questions
      return React.createElement(
        'div',
        null,
        questionNodes,
        React.createElement('input', { className: 'quizBuilderButton', type: 'button', onClick: self.addQuestion.bind(self), value: 'Add Question' })
      );
    }
  }]);

  return QuestionListPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds question data
var QuestionPanel = function (_React$Component) {
  _inherits(QuestionPanel, _React$Component);

  // Create initial data
  function QuestionPanel() {
    _classCallCheck(this, QuestionPanel);

    var _this = _possibleConstructorReturn(this, (QuestionPanel.__proto__ || Object.getPrototypeOf(QuestionPanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.loadQuestions = _this.loadQuestions.bind(_this);
    _this.setQuestionType = _this.setQuestionType.bind(_this);
    _this.updateTitle = _this.updateTitle.bind(_this);
    _this.updateDescription = _this.updateDescription.bind(_this);
    return _this;
  }

  // Load questions in question list


  _createClass(QuestionPanel, [{
    key: "loadQuestions",
    value: function loadQuestions() {
      this.props.parent.loadQuestions();
    }

    // Set the type of the question

  }, {
    key: "setQuestionType",
    value: function setQuestionType(e) {
      sendAjax("PUT", '/setQuestionType', {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        type: e.target.value
      }).then(this.loadQuestions);
    }

    // Update title of question

  }, {
    key: "updateTitle",
    value: function updateTitle(title) {
      sendAjax("PUT", '/updateQuestionTitle', {
        _csrf: this.props.csrf,
        index: this.props.index,
        title: title
      }).then(setMessageSaved);
    }

    // Update description of question

  }, {
    key: "updateDescription",
    value: function updateDescription(content) {
      sendAjax("PUT", '/updateQuestionContent', {
        _csrf: this.props.csrf,
        index: this.props.index,
        content: content
      }).then(setMessageSaved);
    }

    // Render question

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var question = this.props.question;
      var questionTitleId = "questionTitle_" + this.props.index;
      var questionDescriptionId = "questionDescription_" + this.props.index;

      // Check if the question was loaded
      if (!question) {
        return React.createElement(
          "div",
          null,
          "Question Not Loaded"
        );
      }

      // Updates the question's title after the user has stopped typing for half a second.
      var titleUpdater = new DelayUpdateHandler(500, function () {
        _this2.updateTitle($("#" + questionTitleId).val());
      }, setMessageSaving);
      // Updates the question's description after the user has stopped typing for half a second.
      var contentUpdater = new DelayUpdateHandler(500, function () {
        _this2.updateDescription($("#" + questionDescriptionId).val());
      }, setMessageSaving);

      // Pick an answer panel based off the question type
      var answerPanel = void 0;
      switch (question.type) {
        // Multiple Choice question
        case "MultipleChoice":
          answerPanel = React.createElement(AnswerMultipleChoiceListPanel, {
            index: this.props.index,
            question: question,
            onChange: this.loadQuestions,
            csrf: this.props.csrf });
          break;

        // True/False question
        case "TrueFalse":
          answerPanel = React.createElement(AnswerTrueFalsePanel, {
            index: this.props.index,
            question: question,
            onChange: this.loadQuestions,
            csrf: this.props.csrf
          });
          break;

        // Numeric question
        case "Numeric":
          answerPanel = React.createElement(AnswerNumericPanel, {
            index: this.props.index,
            question: question,
            onChange: this.loadQuestions,
            csrf: this.props.csrf
          });
          break;

        // Text Question or default case
        default:
        case "Text":
          answerPanel = React.createElement(AnswerTextPanel, {
            index: this.props.index,
            question: question,
            onChange: this.loadQuestions,
            csrf: this.props.csrf
          });
          break;
      }

      return React.createElement(
        "div",
        { className: "questionPanel" },
        React.createElement(
          "header",
          null,
          React.createElement(
            "span",
            null,
            "Question ",
            this.props.index + 1,
            ": "
          ),
          React.createElement(
            "select",
            {
              className: "questionType",
              defaultValue: question.type,
              onChange: this.setQuestionType
            },
            React.createElement(
              "option",
              { value: "MultipleChoice" },
              "Multiple Choice"
            ),
            React.createElement(
              "option",
              { value: "TrueFalse" },
              "True or False"
            ),
            React.createElement(
              "option",
              { value: "Numeric" },
              "Numeric"
            ),
            React.createElement(
              "option",
              { value: "Text" },
              "Text Answer"
            )
          ),
          React.createElement("input", { type: "button", className: "quizBuilderButton deleteQuestion", value: "Delete Question",
            onClick: function onClick() {
              return _this2.props.parent.deleteQuestion(_this2.props.index);
            }
          })
        ),
        React.createElement("hr", null),
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            null,
            " Title: "
          ),
          React.createElement(AutoExpandTextField, {
            id: questionTitleId,
            className: "questionTitle",
            name: "name",
            placeholder: "Enter Title for Question",
            defaultValue: this.props.question.title,
            onChange: titleUpdater.update
          })
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            null,
            "Question:"
          ),
          React.createElement("br", null),
          React.createElement(AutoExpandTextArea, {
            id: questionDescriptionId,
            className: "questionDescription",
            name: "content",
            placeholder: "Enter description",
            defaultValue: question.content,
            onChange: contentUpdater.update
          }),
          React.createElement("br", null)
        ),
        answerPanel
      );
    }
  }]);

  return QuestionPanel;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Holds the data of the quiz.
// Displays the quiz's title and description.
var QuizInfoPanel = function (_React$Component) {
  _inherits(QuizInfoPanel, _React$Component);

  // Create initial data
  function QuizInfoPanel() {
    _classCallCheck(this, QuizInfoPanel);

    var _this = _possibleConstructorReturn(this, (QuizInfoPanel.__proto__ || Object.getPrototypeOf(QuizInfoPanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.loadQuizInfo = _this.loadQuizInfo.bind(_this);
    _this.updateTitle = _this.updateTitle.bind(_this);
    _this.updateDescription = _this.updateDescription.bind(_this);
    return _this;
  }

  // Gets the information about the quiz from the server


  _createClass(QuizInfoPanel, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadQuizInfo();
    }

    // Load info about the quiz

  }, {
    key: 'loadQuizInfo',
    value: function loadQuizInfo() {
      var _this2 = this;

      sendAjax('GET', '/getQuizInfo').then(function (quizInfo) {
        // Set state of quiz
        _this2.setState({
          data: {
            quizInfo: {
              publicId: quizInfo.publicId,
              title: _.unescape(quizInfo.title || ""), // Handles escape characters
              description: _.unescape(quizInfo.description || "")
            }
          }
        });
      });
    }

    // Update the title of the quiz in the database

  }, {
    key: 'updateTitle',
    value: function updateTitle(title) {
      sendAjax('PUT', '/updateQuizTitle', {
        _csrf: this.props.csrf,
        title: title || "Untitled Quiz"
      }).then(setMessageSaved);
    }

    // Update the description of the quiz in the database  

  }, {
    key: 'updateDescription',
    value: function updateDescription(description) {
      sendAjax('PUT', '/updateQuizDescription', {
        _csrf: this.props.csrf,
        description: description }).then(setMessageSaved);
    }

    // Render the quiz data
    // Renders the whole quiz

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var quizInfo = this.state.data.quizInfo;
      // If the quiz is not ready to show
      if (!quizInfo) {
        return React.createElement(
          'div',
          { id: 'quizInfoPanel' },
          React.createElement(
            'h3',
            null,
            'Quiz Not Loaded'
          )
        );
      };

      // Updates the quiz after the user has stopped typing for half a second.
      var titleUpdater = new DelayUpdateHandler(500, function () {
        _this3.updateTitle($('#quizName').val());
      }, setMessageSaving);
      // Updates the description after the user has stopped typing for half a second.
      var descriptionUpdater = new DelayUpdateHandler(500, function () {
        _this3.updateDescription($('#quizDescription').val());
      }, setMessageSaving);

      return React.createElement(
        'div',
        { id: 'quizInfoPanel' },
        React.createElement(
          'h1',
          null,
          'Quiz Builder'
        ),
        React.createElement(
          'div',
          null,
          'Unique URL:  ',
          React.createElement('input', { id: 'quizURL', type: 'text', value: createQuizURL(quizInfo.publicId), readOnly: true })
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          null,
          React.createElement(AutoExpandTextField, {
            id: "quizName",
            name: "title",
            placeholder: 'Type Quiz Title Here',
            defaultValue: quizInfo.title,
            onChange: titleUpdater.update
          })
        ),
        React.createElement('br', null),
        React.createElement(
          'div',
          null,
          React.createElement(
            'h2',
            null,
            'Description:'
          ),
          React.createElement(AutoExpandTextArea, {
            id: 'quizDescription',
            name: 'name',
            defaultValue: quizInfo.description,
            onChange: descriptionUpdater.update
          })
        ),
        React.createElement(QuestionListPanel, { csrf: this.props.csrf })
      );
    }
  }]);

  return QuizInfoPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// A text area that expands its size automatically to fit the content
var AutoExpandTextArea = function (_React$Component) {
  _inherits(AutoExpandTextArea, _React$Component);

  function AutoExpandTextArea() {
    _classCallCheck(this, AutoExpandTextArea);

    var _this = _possibleConstructorReturn(this, (AutoExpandTextArea.__proto__ || Object.getPrototypeOf(AutoExpandTextArea)).call(this));

    _this.updateSize = _this.updateSize.bind(_this);
    $(window).resize(_this.updateSize); // Update on window resize
    return _this;
  }

  _createClass(AutoExpandTextArea, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      // The text area must render a frame before updating.
      setTimeout(function () {
        window.requestAnimationFrame(_this2.updateSize);
      }, 0);
    }

    // Change the size

  }, {
    key: "updateSize",
    value: function updateSize() {
      var textArea = $("#" + this.props.id)[0];
      textArea.style.height = '0px'; // Force scroll to get scroll height
      textArea.style.height = textArea.scrollHeight + 5 + "px";
    }
  }, {
    key: "render",


    // Render text area
    value: function render() {
      var _this3 = this;

      return React.createElement("textarea", {
        id: this.props.id,
        className: this.props.className,
        type: "text",
        name: this.props.name,
        defaultValue: this.props.defaultValue,
        placeholder: this.props.placeholder,
        onChange: function onChange(e) {
          // Update while new values are entered
          _this3.updateSize();
          // Call the onChanged method sent in.
          _this3.props.onChange(e);
        }
      });
    }
  }]);

  return AutoExpandTextArea;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Text field that automatically expands with content
var AutoExpandTextField = function (_React$Component) {
  _inherits(AutoExpandTextField, _React$Component);

  function AutoExpandTextField() {
    _classCallCheck(this, AutoExpandTextField);

    return _possibleConstructorReturn(this, (AutoExpandTextField.__proto__ || Object.getPrototypeOf(AutoExpandTextField)).apply(this, arguments));
  }

  _createClass(AutoExpandTextField, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement("input", {
        id: this.props.id,
        className: this.props.className,
        type: "text",
        name: this.props.name,
        size:
        // Size it to the default value or the place holder value or to zero
        this.props.defaultValue ? this.props.defaultValue.length : this.props.placeholder ? this.props.placeholder.length : 0,
        placeholder: this.props.placeholder,
        defaultValue: this.props.defaultValue,
        onChange: function onChange(e) {
          // Update length of text field
          e.target.size = e.target.value.length || _this2.props.placeholder.length;
          _this2.props.onChange(e);
        }
      });
    }
  }]);

  return AutoExpandTextField;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Create a delay that can be restarted when updated another time.
var DelayUpdateHandler = function () {
  function DelayUpdateHandler(timeDelay, onDelay, onUpdate) {
    _classCallCheck(this, DelayUpdateHandler);

    this.timer = {}; // timer handler
    this.timeDelay = timeDelay; // The time in milliseconds before the time out
    this.onUpdate = onUpdate; // Function that is run the moment it is updated
    this.onDelay = onDelay; // Function that is run when time out is done.

    this.update = this.update.bind(this);
  }

  // Starts/Restarts timeout


  _createClass(DelayUpdateHandler, [{
    key: "update",
    value: function update() {
      // If the timer exists, cancel it.
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
      // If there is an on update function, call it
      if (this.onUpdate) {
        this.onUpdate();
      }

      // Start timer
      this.timer = window.setTimeout(this.onDelay, this.timeDelay);
    }
  }]);

  return DelayUpdateHandler;
}();
'use strict';

// Handle error by updating text of error div
var handleError = function handleError(message) {
  $('#errorMessage').text(message);
};

// Redirect webpage
var redirect = function redirect(response) {
  window.location = response.redirect;
};

// Send ajax request. Returns a JQuery differed object that can be treated like a promise.
var sendAjax = function sendAjax(type, action, data, success) {
  return $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      console.dir(action);
      handleError(messageObj.error);
    }
  });
};

// Create the quiz URL
var createQuizURL = function createQuizURL(publicId) {
  return window.location.host + '/quizPlayer?quiz=' + publicId;
};

// Tell user that the quiz is saving.
var setMessageSaving = function setMessageSaving() {
  $('#quizSaveMessage').text('Quiz is Saving...');
};

// Tell the user that the quiz is up-to-date/saved.
var setMessageSaved = function setMessageSaved() {
  $('#quizSaveMessage').text('Quiz Up-To-Date');
};
