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

// Panel that holds the list of answers
var AnswerListPanel = function (_React$Component) {
  _inherits(AnswerListPanel, _React$Component);

  // Create initial data
  function AnswerListPanel() {
    _classCallCheck(this, AnswerListPanel);

    var _this = _possibleConstructorReturn(this, (AnswerListPanel.__proto__ || Object.getPrototypeOf(AnswerListPanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.loadAnswers = _this.loadAnswers.bind(_this);
    return _this;
  }

  // Load answer from the server and set the state


  _createClass(AnswerListPanel, [{
    key: 'loadAnswers',
    value: function loadAnswers() {
      var self = this;
      this.props.parent.loadAnswers();
    }

    // Add an answer to the question

  }, {
    key: 'addAnswer',
    value: function addAnswer() {
      var self = this;
      sendAjax('POST', '/buildAnswer', { _csrf: self.props.csrf, questionIndex: self.props.parent.props.index }).then(self.loadAnswers.bind(self));
    }

    // Delete answer from question

  }, {
    key: 'deleteAnswer',
    value: function deleteAnswer(answerIndex) {
      var self = this;
      sendAjax('DELETE', '/deleteAnswer', {
        _csrf: self.props.csrf,
        questionIndex: self.props.parent.props.index,
        answerIndex: answerIndex
      }).then(self.loadAnswers.bind(self));
    }

    // Update if answer is correct

  }, {
    key: 'updateCorrectAnswer',
    value: function updateCorrectAnswer(answerIndex, isCorrect) {
      this.props.parent.updateCorrectAnswer(answerIndex, isCorrect);
    }
  }, {
    key: 'render',
    value: function render() {
      var self = this;
      var answers = this.props.answers || [];
      var correctAnswer = this.props.correctAnswer;

      // Answer panels for each answer id
      var answerNodes = answers.map(function (answer, index) {
        // Renders the actual answer
        return React.createElement(AnswerPanel, {
          key: answer._id,
          index: index,
          parent: self,
          answer: answer,
          isCorrect: index === correctAnswer,
          csrf: self.props.csrf
        });
      });

      // Render answers
      return React.createElement(
        'div',
        null,
        answerNodes,
        React.createElement('input', { className: 'quizBuilderButton', type: 'button', onClick: self.addAnswer.bind(self), value: 'Add Answer' })
      );
    }
  }]);

  return AnswerListPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds an answer to the question
var AnswerPanel = function (_React$Component) {
  _inherits(AnswerPanel, _React$Component);

  // Create initial data
  function AnswerPanel() {
    _classCallCheck(this, AnswerPanel);

    var _this = _possibleConstructorReturn(this, (AnswerPanel.__proto__ || Object.getPrototypeOf(AnswerPanel)).call(this));

    _this.state = {};
    _this.state.data = {};
    return _this;
  }

  // Update this answer


  _createClass(AnswerPanel, [{
    key: "updateAnswer",
    value: function updateAnswer(content) {
      var self = this;
      sendAjax("PUT", '/updateAnswer', {
        _csrf: self.props.csrf,
        questionIndex: self.props.parent.props.parent.props.index,
        answerIndex: self.props.index,
        content: content
      });
    }

    // Render answer

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var answer = this.props.answer;
      var answerContentId = "answerContent_a" + this.props.index + "_q" + this.props.parent.props.parent.props.index;

      // Check if the answer is loaded
      if (!answer) {
        return React.createElement(
          "div",
          null,
          " Answer Not Loaded"
        );
      }

      // Updates the answer after the user has stopped typing for half a second.
      var answerUpdater = new DelayUpdateHandler(500, function () {
        _this2.updateAnswer($("#" + answerContentId).val());
      });

      // Final render
      return React.createElement(
        "div",
        { className: "answerPanel" },
        React.createElement("input", { type: "button", className: "quizBuilderButton",
          value:
          // Set the change correctness button icon
          this.props.isCorrect ? "✔" : "✘",
          onClick:
          // Change the answer correctness
          function onClick() {
            return _this2.props.parent.updateCorrectAnswer(_this2.props.index, !_this2.props.isCorrect);
          }
        }),
        React.createElement("input", { id: answerContentId, className: "questionTitle", type: "text", name: "content",
          defaultValue: _.unescape(answer.content || ""),
          placeholder: "Enter Answer",
          size: answer.content ? answer.content.length || 10 : 10,
          onChange: function onChange(e) {
            // Set size of info field
            e.target.size = e.target.value.length || 10;
            // Update answer
            answerUpdater.update();
          }
        }),
        React.createElement("input", { type: "button", className: "quizBuilderButton", value: "Delete Answer",
          onClick: function onClick() {
            return _this2.props.parent.deleteAnswer(_this2.props.index);
          }
        })
      );
    }
  }]);

  return AnswerPanel;
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
    return _this;
  }

  // Loads the questions.


  _createClass(QuestionListPanel, [{
    key: 'loadQuestions',
    value: function loadQuestions() {
      this.props.loadQuestions();
    }

    // Add question to quiz

  }, {
    key: 'addQuestion',
    value: function addQuestion() {
      var self = this;
      sendAjax('POST', '/buildQuestion', { _csrf: this.props.csrf }).then(function (data) {
        self.loadQuestions();
      });
    }

    // Delete question from quiz

  }, {
    key: 'deleteQuestion',
    value: function deleteQuestion(questionIndex) {
      var self = this;
      sendAjax('DELETE', '/deleteQuestion', { _csrf: this.props.csrf, index: questionIndex }).then(function (data) {
        self.loadQuestions();
      });
    }

    // Render the questions

  }, {
    key: 'render',
    value: function render() {
      var self = this;
      var questions = this.props.questions;

      // Check if question ids are loaded
      if (!questions) {
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
        return React.createElement(QuestionPanel, { key: question._id, index: index, question: question, parent: self, csrf: self.props.csrf });
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

    _this.loadAnswers = _this.loadAnswers.bind(_this);
    return _this;
  }

  _createClass(QuestionPanel, [{
    key: "loadAnswers",
    value: function loadAnswers() {
      this.props.parent.loadQuestions();
    }

    // Update title of question

  }, {
    key: "updateTitle",
    value: function updateTitle(title) {
      var self = this;
      sendAjax("PUT", '/updateQuestionTitle', {
        _csrf: self.props.csrf,
        index: self.props.index,
        title: title
      });
    }

    // Update description of question

  }, {
    key: "updateDescription",
    value: function updateDescription(content) {
      var self = this;
      sendAjax("PUT", '/updateQuestionContent', {
        _csrf: self.props.csrf,
        index: self.props.index,
        content: content
      });
    }

    // Update the correct answer of the question

  }, {
    key: "updateCorrectAnswer",
    value: function updateCorrectAnswer(answerIndex, isCorrect) {
      var self = this;
      sendAjax("PUT", '/updateQuestionCorrectAnswer', {
        _csrf: self.props.csrf,
        questionIndex: self.props.index,
        answerIndex: answerIndex,
        isCorrect: isCorrect
      }).then(self.loadAnswers);
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

      // The resize requires that the DOM element itself is rendered
      // This means that we have to wait for the first frame to be rendered.
      setTimeout(function () {
        window.requestAnimationFrame(function () {
          var questionFields = $(".questionDescription").toArray();
          questionFields.forEach(function (descriptionField) {
            updateTextAreaSize(descriptionField);
          }, _this2);
        });
      }, 0);

      // Updates the question's title after the user has stopped typing for half a second.
      var titleUpdater = new DelayUpdateHandler(500, function () {
        _this2.updateTitle($("#" + questionTitleId).val());
      });
      // Updates the question's description after the user has stopped typing for half a second.
      var contentUpdater = new DelayUpdateHandler(500, function () {
        _this2.updateDescription($("#" + questionDescriptionId).val());
      });

      var self = this;
      return React.createElement(
        "div",
        { className: "questionPanel" },
        React.createElement(
          "span",
          null,
          "Question ",
          this.props.index + 1,
          ":"
        ),
        React.createElement("input", { type: "button", className: "quizBuilderButton deleteQuestion", value: "Delete Question",
          onClick: function onClick() {
            return _this2.props.parent.deleteQuestion(_this2.props.index);
          }
        }),
        React.createElement(
          "select",
          { defaultValue: question.__t,
            onChange: function onChange(e) {
              sendAjax("PUT", '/setQuestiontype', {
                _csrf: self.props.csrf,
                questionIndex: self.props.index,
                type: e.target.value
              }).then(self.loadAnswers);
            }
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
        React.createElement("hr", null),
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            null,
            " Title: "
          ),
          React.createElement("input", { id: questionTitleId, className: "questionTitle", type: "text", name: "name",
            defaultValue: decodeURI(question.title || ""),
            placeholder: "Enter Title for Question",
            size: question.title ? question.title.length || 20 : 20,
            onChange: function onChange(e) {
              // Update field size
              e.target.size = e.target.value.length || 20;

              // Update title
              titleUpdater.update();
            }
          }),
          React.createElement("br", null)
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
          React.createElement("textarea", { id: questionDescriptionId, className: "questionDescription", type: "text", name: "content",
            placeholder: "Enter description",
            defaultValue: question.content,
            onChange: function onChange(e) {
              // Update description
              contentUpdater.update();

              // Update text area size
              updateTextAreaSize(e.target);
            } }),
          React.createElement("br", null)
        ),
        function () {
          switch (question.__t) {
            case "TrueFalse":
              return React.createElement("input", { type: "button", className: "quizBuilderButton",
                value:
                // Set the change correctness button icon
                question.isTrue ? "✔" : "✘",
                onClick:
                // Change the answer correctness
                function onClick(e) {
                  sendAjax("PUT", '/updateAnswerIsTrue', {
                    _csrf: self.props.csrf,
                    questionIndex: self.props.index,
                    isTrue: !question.isTrue
                  }).then(self.loadAnswers);
                }
              });
            case "MultipleChoice":
            default:
              return React.createElement(AnswerListPanel, { answers: question.answers, parent: self, correctAnswer: question.correctAnswerIndex, csrf: _this2.props.csrf });
          }
        }()
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

    _this.loadQuestions = _this.loadQuestions.bind(_this);
    return _this;
  }

  // Gets the information about the quiz from the server


  _createClass(QuizInfoPanel, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var self = this;
      sendAjax('GET', '/getQuiz').then(function (data) {
        // Set state of quiz
        self.setState({
          data: {
            quiz: {
              title: _.unescape(data.quiz.title || ""), // Handles escape characters
              description: _.unescape(data.quiz.description || ""),
              questions: data.quiz.questions
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
      });
    }

    // Update the description of the quiz in the database  

  }, {
    key: 'updateDescription',
    value: function updateDescription(description) {
      sendAjax('PUT', '/updateQuizDescription', {
        _csrf: this.props.csrf,
        description: description });
    }
  }, {
    key: 'loadQuestions',
    value: function loadQuestions() {
      var self = this;
      sendAjax('GET', '/getQuiz').then(function (data) {
        // Set state of quiz
        self.setState({
          data: {
            quiz: {
              title: _.unescape(data.quiz.title || ""), // Handles escape characters
              description: _.unescape(data.quiz.description || ""),
              questions: data.quiz.questions
            }
          }
        });
      });
    }

    // Render the quiz data
    // Renders the whole quiz

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var quiz = this.state.data.quiz;
      // If the quiz is not ready to show
      if (!quiz) {
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
        _this2.updateTitle($('#quizName').val());
      });
      // Updates the description after the user has stopped typing for half a second.
      var descriptionUpdater = new DelayUpdateHandler(500, function () {
        _this2.updateDescription($('#quizDescription').val());
      });

      // The resize requires that the DOM element itself is rendered
      // This means that we have to wait for the first frame to be rendered.
      setTimeout(function () {
        window.requestAnimationFrame(function () {
          updateTextAreaSize($("#quizDescription")[0]);
        });
      }, 0);

      return React.createElement(
        'div',
        { id: 'quizInfoPanel' },
        React.createElement(
          'h1',
          null,
          'Quiz Builder'
        ),
        React.createElement('hr', null),
        'Fields are saved automatically. Just type.',
        React.createElement('br', null),
        'Click on the \'\u2718\' next to answer to mark it true.',
        React.createElement('br', null),
        'Click on the \'\u2714\' next to answer to mark it false.',
        React.createElement('br', null),
        'Only one answer can be true at a time.',
        React.createElement('hr', null),
        React.createElement(
          'div',
          null,
          React.createElement('input', { id: 'quizName', type: 'text', name: 'title',
            size: quiz.title.length || 25,
            placeholder: 'Type Quiz Title Here',
            defaultValue: quiz.title,
            onChange: function onChange(e) {
              // Update length of field
              e.target.size = e.target.value.length || 25;
              // Update the name of the quiz
              titleUpdater.update();
            }
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
          React.createElement('textarea', { id: 'quizDescription', type: 'text', name: 'name',
            defaultValue: quiz.description,
            onChange: function onChange(e) {
              // Update the quiz description
              descriptionUpdater.update();
              // Update the size of the text area
              updateTextAreaSize(e.target);
            }
          })
        ),
        React.createElement(QuestionListPanel, { questions: quiz.questions, loadQuestions: this.loadQuestions, csrf: this.props.csrf })
      );
    }
  }]);

  return QuizInfoPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Create a delay that can be restarted when updated another time.
var DelayUpdateHandler = function () {
  function DelayUpdateHandler(timeDelay, onDelay) {
    _classCallCheck(this, DelayUpdateHandler);

    this.timer = {}; // time out handler
    this.timeDelay = timeDelay; // The time in milliseconds before the time out
    this.onDelay = onDelay; // Function that is run when time out is done.
  }

  // Starts/Restarts timeout


  _createClass(DelayUpdateHandler, [{
    key: "update",
    value: function update() {
      // If the timer exists, cancel it.
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
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
      handleError(messageObj.error);
    }
  });
};

// Update the size of a text area
var updateTextAreaSize = function updateTextAreaSize(_textArea) {
  var textArea = _textArea;
  textArea.style.height = '0px';
  textArea.style.height = textArea.scrollHeight + 5 + 'px';
};
