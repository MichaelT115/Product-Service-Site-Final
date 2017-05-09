'use strict';

// Setup the quiz player page
var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(GamePanel, { csrf: csrf }), document.querySelector('#quizPlayer'));
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

// Panel that holds the list of answers to the question
var AnswerListPanel = function (_React$Component) {
  _inherits(AnswerListPanel, _React$Component);

  // Create initial data
  function AnswerListPanel() {
    _classCallCheck(this, AnswerListPanel);

    var _this = _possibleConstructorReturn(this, (AnswerListPanel.__proto__ || Object.getPrototypeOf(AnswerListPanel)).call(this));

    _this.state = {};
    _this.state.data = {};
    return _this;
  }

  // When this component is rendered, load the answers


  _createClass(AnswerListPanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadAnswers();
    }

    // Request answer IDs

  }, {
    key: 'loadAnswers',
    value: function loadAnswers() {
      var self = this;
      sendAjax('GET', '/getAnswerIds?questionId=' + this.props._id, { _csrf: this.props.csrf }).then(function (data) {
        self.setState({
          data: { answerIds: data.answerIds }
        });
      });
    }

    // Submit answer to the question

  }, {
    key: 'submitAnswer',
    value: function submitAnswer(answerId) {
      this.props.parent.submitAnswer(answerId);
    }

    // Render answers

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var self = this;
      var answerIds = this.state.data.answerIds;

      // Check if the answer IDs are loaded
      if (!answerIds) {
        return React.createElement(
          'div',
          null,
          'Answers not loaded'
        );
      }

      // Create answer panels
      var answerNodes = answerIds.map(function (answerId, index) {
        // Render the answer itself
        return React.createElement(AnswerPanel, { key: answerId._id, index: index + 1, _id: answerId._id, parent: self, isCorrect: answerId._id === _this2.props.correctAnswer, csrf: self.props.csrf });
      });

      // Render
      return React.createElement(
        'div',
        null,
        answerNodes
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

// Panel that holds an answer to a question
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

  // After the component is rendered, load the answer data


  _createClass(AnswerPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      sendAjax('GET', "/getAnswer?answerId=" + this.props._id, { _csrf: self.props.csrf }).then(self.updateState.bind(self));
    }

    // Update the answer data

  }, {
    key: "updateState",
    value: function updateState(response) {
      this.setState({
        data: {
          answer: response.answer
        }
      });
    }

    // Render answer

  }, {
    key: "render",
    value: function render() {
      var self = this;
      var answer = self.state.data.answer;

      // Check if the answer is loaded
      if (!answer) {
        return React.createElement(
          "div",
          null,
          " Answer Not Loaded"
        );
      }

      // Render answer
      return React.createElement(
        "div",
        { className: "answerPanel" },
        React.createElement("input", { type: "button", className: "quizBuilderButton",
          value: answer.content,
          onClick: function onClick() {
            self.props.parent.submitAnswer(self.props._id);
          }
        })
      );
    }
  }]);

  return AnswerPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameInfoPanel = function (_React$Component) {
  _inherits(GameInfoPanel, _React$Component);

  function GameInfoPanel() {
    _classCallCheck(this, GameInfoPanel);

    return _possibleConstructorReturn(this, (GameInfoPanel.__proto__ || Object.getPrototypeOf(GameInfoPanel)).apply(this, arguments));
  }

  _createClass(GameInfoPanel, [{
    key: "render",

    // Render game info
    value: function render() {
      var self = this;

      // Check if data is loaded.
      if (!(self.props.quiz && self.props.questions && self.props.game)) {
        return React.createElement(
          "div",
          null,
          "Quiz Info Not Loaded"
        );
      }

      // Render game info
      return React.createElement(
        "div",
        { className: "questionPanel" },
        "Number of Questions:  ",
        this.props.questions.length,
        React.createElement("br", null),
        "Score: ",
        this.props.game.score,
        React.createElement("br", null),
        "Question: ",
        this.props.game.currentIndex + 1
      );
    }
  }]);

  return GameInfoPanel;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds the game
var GamePanel = function (_React$Component) {
  _inherits(GamePanel, _React$Component);

  // Create initial data
  function GamePanel() {
    _classCallCheck(this, GamePanel);

    var _this = _possibleConstructorReturn(this, (GamePanel.__proto__ || Object.getPrototypeOf(GamePanel)).call(this));

    _this.state = {};
    _this.state.data = {};
    _this.state.game = {
      score: 0,
      currentIndex: 0
    };
    return _this;
  }

  // When the component is rendered, load quiz and question IDs.


  _createClass(GamePanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var self = this;

      // Load quiz and question IDs
      $.when(sendAjax('GET', '/getQuiz', { _csrf: this.props.csrf }), sendAjax('GET', '/getQuestionIds', { _csrf: this.props.csrf })).done(function (quizData, questionsData) {
        // Change state with new data
        self.setState({
          data: {
            quiz: {
              _id: quizData[0].quiz._id,
              name: _.unescape(quizData[0].quiz.name || ""), // Handles escape characters
              description: _.unescape(quizData[0].quiz.description || "")
            },
            questions: questionsData[0].questionIds
          }
        });
      });
    }

    // Add score to game

  }, {
    key: 'addScore',
    value: function addScore(score) {
      this.state.game.score += score;
      this.setState(this.state.game);
    }

    // Move to next question

  }, {
    key: 'nextQuestion',
    value: function nextQuestion() {
      var game = this.state.game;
      var questions = this.state.data.questions;

      // Change the current question index
      game.currentIndex += 1;
      if (game.currentIndex >= questions.length) {
        game.currentIndex = -1;
      }

      // Update game state
      this.setState(game);
    }

    // Render game

  }, {
    key: 'render',
    value: function render() {
      var self = this;
      var questions = this.state.data.questions;
      var quiz = this.state.data.quiz;
      var game = this.state.game;

      // Check if the quiz is loaded
      if (!(quiz && questions)) {
        return React.createElement(
          'div',
          null,
          'Question Not Loaded'
        );
      }

      // Check if the game is over, and render the game over screen
      if (game.currentIndex === -1) {
        return React.createElement(
          'div',
          { className: 'questionPanel' },
          'Finished!!!',
          React.createElement('br', null),
          'Your score is: ',
          game.score
        );
      }

      // Render game
      return React.createElement(
        'div',
        { className: 'questionPanel' },
        React.createElement(GameInfoPanel, { quiz: this.state.data.quiz, questions: this.state.data.questions, game: this.state.game }),
        React.createElement(QuestionPanel, { key: questions[game.currentIndex]._id, index: game.currentIndex + 1, _id: questions[game.currentIndex]._id, parent: self, csrf: self.props.csrf })
      );
    }
  }]);

  return GamePanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds the current question
var QuestionPanel = function (_React$Component) {
  _inherits(QuestionPanel, _React$Component);

  // Create initial data
  function QuestionPanel() {
    _classCallCheck(this, QuestionPanel);

    var _this = _possibleConstructorReturn(this, (QuestionPanel.__proto__ || Object.getPrototypeOf(QuestionPanel)).call(this));

    _this.state = {};
    _this.state.data = {};
    return _this;
  }

  // When the component is loaded, load the question


  _createClass(QuestionPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      sendAjax('GET', "/getQuestion?questionId=" + this.props._id, { _csrf: this.props.csrf }).then(this.updateStateQuestion.bind(self));
    }

    // Update the state with the question

  }, {
    key: "updateStateQuestion",
    value: function updateStateQuestion(response) {
      var question = response.question;

      this.setState({
        data: {
          question: {
            title: _.unescape(question.title),
            description: _.unescape(question.description),
            correctAnswer: question.correctAnswer
          }
        }
      });
    }

    // Submit answer

  }, {
    key: "submitAnswer",
    value: function submitAnswer(answerId) {
      // Check if the answer is correct
      var isCorrect = answerId === this.state.data.question.correctAnswer;

      if (isCorrect) {
        this.props.parent.addScore(100);
        this.props.parent.nextQuestion();
      } else {
        this.props.parent.addScore(-25);
      }

      return isCorrect;
    }

    // Render question

  }, {
    key: "render",
    value: function render() {
      var self = this;
      var question = this.state.data.question;

      // Check if the question is loaded
      if (!question) {
        return React.createElement(
          "div",
          null,
          "Question Not Loaded"
        );
      }

      /// Render question
      return React.createElement(
        "div",
        { className: "questionPanel" },
        this.props.index,
        ". ",
        question.title,

        // Make sure there are line breaks. Based off: http://stackoverflow.com/questions/35351706/how-to-render-a-multi-line-text-string-in-react
        question.description.split("\n").map(function (line, index) {
          return React.createElement(
            "p",
            { key: index },
            line
          );
        }),
        React.createElement(AnswerListPanel, { _id: this.props._id, parent: self, correctAnswer: question.correctAnswer, csrf: this.props.csrf })
      );
    }
  }]);

  return QuestionPanel;
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
