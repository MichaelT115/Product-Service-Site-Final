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

// Panel that holds the list of answers to a multiple choice question
var AnswerMultipleChoiceListPanel = function (_React$Component) {
  _inherits(AnswerMultipleChoiceListPanel, _React$Component);

  // Create initial data
  function AnswerMultipleChoiceListPanel() {
    _classCallCheck(this, AnswerMultipleChoiceListPanel);

    var _this = _possibleConstructorReturn(this, (AnswerMultipleChoiceListPanel.__proto__ || Object.getPrototypeOf(AnswerMultipleChoiceListPanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.loadAnswers = _this.loadAnswers.bind(_this);
    _this.submitAnswer = _this.submitAnswer.bind(_this);
    return _this;
  }

  // When this component is rendered, load the answers


  _createClass(AnswerMultipleChoiceListPanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadAnswers();
    }

    // Request answerss

  }, {
    key: 'loadAnswers',
    value: function loadAnswers() {
      var _this2 = this;

      sendAjax('GET', '/getAnswers?question=' + this.props.index, { _csrf: this.props.csrf }).then(function (answers) {
        _this2.setState({
          data: { answers: answers }
        });
      });
    }

    // Submit answer to the question

  }, {
    key: 'submitAnswer',
    value: function submitAnswer(answer) {
      var _this3 = this;

      sendAjax('GET', '/getIsCorrectAnswer?question=' + this.props.index + '&answer=' + answer, { _csrf: this.props.csrf }).then(function (data) {
        // Handles if the answer is correct or not.
        data.isCorrect ? _this3.props.onCorrectAnswer() : _this3.props.onWrongAnswer();
      });
    }

    // Render answers

  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var answers = this.state.data.answers;

      // Check if the answer IDs are loaded
      if (!answers) {
        return React.createElement(
          'div',
          null,
          'Answers not loaded'
        );
      }

      // Create answer panels
      var answerNodes = answers.map(function (answer, index) {
        // Render the answer itself
        return React.createElement(AnswerMultipleChoicePanel, {
          key: answer.id,
          index: index,
          answer: answer,
          submitAnswer: _this4.submitAnswer,
          csrf: _this4.props.csrf
        });
      });

      // Render
      return React.createElement(
        'div',
        null,
        answerNodes
      );
    }
  }]);

  return AnswerMultipleChoiceListPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds a single answer to a multiple question
var AnswerMultipleChoicePanel = function (_React$Component) {
  _inherits(AnswerMultipleChoicePanel, _React$Component);

  function AnswerMultipleChoicePanel() {
    _classCallCheck(this, AnswerMultipleChoicePanel);

    return _possibleConstructorReturn(this, (AnswerMultipleChoicePanel.__proto__ || Object.getPrototypeOf(AnswerMultipleChoicePanel)).apply(this, arguments));
  }

  _createClass(AnswerMultipleChoicePanel, [{
    key: "render",

    // Render answer
    value: function render() {
      var _this2 = this;

      var answer = this.props.answer;
      // Render answer
      return React.createElement(
        "div",
        { className: "answerPanel" },
        React.createElement(
          "span",
          null,
          this.props.index + 1,
          ". "
        ),
        React.createElement("input", { type: "button", className: "quizBuilderButton",
          value: _.unescape(answer.content),
          onClick: function onClick() {
            return _this2.props.submitAnswer(_this2.props.index);
          }
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

// Allows the user to input an answer to a numeric question
var AnswerNumericPanel = function (_React$Component) {
  _inherits(AnswerNumericPanel, _React$Component);

  // Create initial data
  function AnswerNumericPanel() {
    _classCallCheck(this, AnswerNumericPanel);

    var _this = _possibleConstructorReturn(this, (AnswerNumericPanel.__proto__ || Object.getPrototypeOf(AnswerNumericPanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.submitAnswer = _this.submitAnswer.bind(_this);
    return _this;
  }

  // Submit answer to the question


  _createClass(AnswerNumericPanel, [{
    key: "submitAnswer",
    value: function submitAnswer(answer) {
      var _this2 = this;

      sendAjax('GET', "/getIsAnswerNumeric?question=" + this.props.index + "&answer=" + answer, { _csrf: this.props.csrf }).then(function (data) {
        // Handles if the answer is correct or not.
        data.isCorrect ? _this2.props.onCorrectAnswer() : _this2.props.onWrongAnswer();
      });
    }

    // Render answers

  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // Render
      return React.createElement(
        "div",
        null,
        "Answer:",
        React.createElement("input", {
          id: "AnswerNumber",
          className: "questionInput questionInputNumeric",
          type: "number",
          step: 0.1
        }),
        React.createElement("input", {
          type: "button",
          className: "quizBuilderButton",
          value: "Submit Number",
          onClick: function onClick() {
            return _this3.submitAnswer($("#AnswerNumber").val());
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

// Allows the user to input an answer to a text question
var AnswerTextPanel = function (_React$Component) {
  _inherits(AnswerTextPanel, _React$Component);

  // Create initial data
  function AnswerTextPanel() {
    _classCallCheck(this, AnswerTextPanel);

    var _this = _possibleConstructorReturn(this, (AnswerTextPanel.__proto__ || Object.getPrototypeOf(AnswerTextPanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.submitAnswer = _this.submitAnswer.bind(_this);
    return _this;
  }

  // Submit answer to the question


  _createClass(AnswerTextPanel, [{
    key: "submitAnswer",
    value: function submitAnswer(answer) {
      var _this2 = this;

      sendAjax('GET', "/getIsAnswerText?question=" + this.props.index + "&answer=" + answer, { _csrf: this.props.csrf }).then(function (data) {
        // Handles if the answer is correct or not.
        data.isCorrect ? _this2.props.onCorrectAnswer() : _this2.props.onWrongAnswer();
      });
    }

    // Render answers

  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // Render
      return React.createElement(
        "div",
        null,
        "Answer:",
        React.createElement("input", {
          id: "AnswerText",
          className: "questionInput",
          type: "text"
        }),
        React.createElement("input", {
          type: "button",
          className: "quizBuilderButton",
          value: "Submit Text",
          onClick: function onClick() {
            return _this3.submitAnswer($("#AnswerText").val());
          }
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

// Allows the user to input an answer to a True/False question
var AnswerTrueFalsePanel = function (_React$Component) {
  _inherits(AnswerTrueFalsePanel, _React$Component);

  // Create initial data
  function AnswerTrueFalsePanel() {
    _classCallCheck(this, AnswerTrueFalsePanel);

    var _this = _possibleConstructorReturn(this, (AnswerTrueFalsePanel.__proto__ || Object.getPrototypeOf(AnswerTrueFalsePanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.submitAnswer = _this.submitAnswer.bind(_this);
    return _this;
  }

  // Submit answer to the question


  _createClass(AnswerTrueFalsePanel, [{
    key: "submitAnswer",
    value: function submitAnswer(answer) {
      var _this2 = this;

      sendAjax('GET', "/getIsAnswerIsTrue?question=" + this.props.index + "&answer=" + answer, { _csrf: this.props.csrf }).then(function (data) {
        // Handles if the answer is correct or not.
        data.isCorrect ? _this2.props.onCorrectAnswer() : _this2.props.onWrongAnswer();
      });
    }

    // Render answers

  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // Render
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "answerPanel" },
          React.createElement("input", { type: "button", className: "quizBuilderButton",
            value: "✔ TRUE",
            onClick: function onClick() {
              return _this3.submitAnswer(true);
            }
          })
        ),
        React.createElement(
          "div",
          { className: "answerPanel" },
          React.createElement("input", { type: "button", className: "quizBuilderButton",
            value: "✘ FALSE",
            onClick: function onClick() {
              return _this3.submitAnswer(false);
            }
          })
        )
      );
    }
  }]);

  return AnswerTrueFalsePanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Displays info about the game
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
      var game = this.props.game;
      var quizInfo = this.props.quizInfo;

      // Render game info
      return React.createElement(
        "div",
        { className: "questionPanel" },
        "Question Count:  ",
        quizInfo.questionCount,
        React.createElement("br", null),
        "Score: ",
        game.score,
        React.createElement("br", null),
        "Question: ",
        game.currentIndex + 1
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
    _this.state.ad = {};

    _this.loadQuizInfo = _this.loadQuizInfo.bind(_this);
    _this.nextQuestion = _this.nextQuestion.bind(_this);
    _this.addScore = _this.addScore.bind(_this);
    _this.onFinished = _this.onFinished.bind(_this);
    return _this;
  }

  // When the component is rendered, load quiz and question IDs.


  _createClass(GamePanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadQuizInfo();
    }
  }, {
    key: 'loadQuizInfo',
    value: function loadQuizInfo() {
      var _this2 = this;

      sendAjax('GET', '/getQuizInfo').then(function (quizInfo) {
        // Set state of quiz
        _this2.setState({
          data: {
            quizInfo: quizInfo
          },
          ad: {
            hasSeenAd: false,
            adIndex: Math.round(Math.random() * quizInfo.questionCount)
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
      var questionCount = this.state.data.quizInfo.questionCount;

      // Change the current question index
      game.currentIndex += 1;
      if (game.currentIndex >= questionCount) {
        this.onFinished();
      }

      // Update game state
      this.setState(game);
    }

    // Handles what happen when the user finishes the game

  }, {
    key: 'onFinished',
    value: function onFinished() {
      this.state.game.currentIndex = -1;
      sendAjax('POST', '/addLeaderboardEntry', { _csrf: this.props.csrf, score: this.state.game.score });
      sendAjax('POST', '/addHistoryEntry', { _csrf: this.props.csrf, score: this.state.game.score });
    }

    // Render game

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var self = this;
      var quizInfo = this.state.data.quizInfo;
      var game = this.state.game;

      if (!quizInfo) {
        return React.createElement(
          'div',
          null,
          'Test'
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

      // Render advertising
      if (!this.state.ad.hasSeenAd && game.currentIndex === this.state.ad.adIndex) return React.createElement(
        'div',
        { className: 'questionPanel' },
        React.createElement(
          'h1',
          null,
          'ADVERTISEMENT'
        ),
        React.createElement('img', { className: 'ad', src: 'assets/ads/Domomaker.png', alt: 'Put your add here' }),
        React.createElement('br', null),
        React.createElement('input', { type: 'button', className: 'quizBuilderButton',
          value: "Next",
          onClick: function onClick() {
            return _this3.setState({ ad: { hasSeenAd: false } });
          }
        })
      );

      // Render game
      return React.createElement(
        'div',
        { className: 'questionPanel' },
        React.createElement(GameInfoPanel, { quizInfo: quizInfo, game: game }),
        React.createElement(QuestionPanel, {
          key: game.currentIndex,
          quizInfo: quizInfo,
          game: game,
          nextQuestion: this.nextQuestion,
          addScore: this.addScore
        })
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

    _this.getQuestion = _this.getQuestion.bind(_this);
    _this.pickAnswerPanel = _this.pickAnswerPanel.bind(_this);
    return _this;
  }

  // When the component is loaded, load the question


  _createClass(QuestionPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getQuestion();
    }

    // Loads the question from the server

  }, {
    key: "getQuestion",
    value: function getQuestion() {
      var _this2 = this;

      sendAjax('GET', "/getQuestion?question=" + this.props.game.currentIndex, { _csrf: this.props.csrf }).then(function (question) {
        _this2.setState({ data: { question: question } });
      });
    }

    // Picks an answer panel to use for the question.

  }, {
    key: "pickAnswerPanel",
    value: function pickAnswerPanel() {
      var _this3 = this;

      // Each question adds 25 points if right and take 5 points if wrong
      var answerPanel = void 0;
      switch (this.state.data.question.type) {
        case "MultipleChoice":
          answerPanel = React.createElement(AnswerMultipleChoiceListPanel, {
            index: this.props.game.currentIndex,
            onCorrectAnswer: function onCorrectAnswer() {
              _this3.props.addScore(25);
              _this3.props.nextQuestion();
            },
            onWrongAnswer: function onWrongAnswer() {
              _this3.props.addScore(-5);
            },
            csrf: this.props.csrf
          });
          break;

        case "TrueFalse":
          answerPanel = React.createElement(AnswerTrueFalsePanel, {
            index: this.props.game.currentIndex,
            onCorrectAnswer: function onCorrectAnswer() {
              _this3.props.addScore(25);
              _this3.props.nextQuestion();
            },
            onWrongAnswer: function onWrongAnswer() {
              _this3.props.addScore(-5);
            },
            csrf: this.props.csrf
          });
          break;

        case "Numeric":
          answerPanel = React.createElement(AnswerNumericPanel, {
            index: this.props.game.currentIndex,
            onCorrectAnswer: function onCorrectAnswer() {
              _this3.props.addScore(25);
              _this3.props.nextQuestion();
            },
            onWrongAnswer: function onWrongAnswer() {
              _this3.props.addScore(-5);
            },
            csrf: this.props.csrf
          });
          break;

        default:
        case "Text":
          answerPanel = React.createElement(AnswerTextPanel, {
            index: this.props.game.currentIndex,
            onCorrectAnswer: function onCorrectAnswer() {
              _this3.props.addScore(25);
              _this3.props.nextQuestion();
            },
            onWrongAnswer: function onWrongAnswer() {
              _this3.props.addScore(-5);
            },
            csrf: this.props.csrf
          });
          break;
      }

      return answerPanel;
    }

    // Render question

  }, {
    key: "render",
    value: function render() {
      var question = this.state.data.question;
      var index = this.props.game.currentIndex;

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
        index + 1,
        ". ",
        question.title,

        // Make sure there are line breaks. Based off: http://stackoverflow.com/questions/35351706/how-to-render-a-multi-line-text-string-in-react
        question.content.split("\n").map(function (line, index) {
          return React.createElement(
            "p",
            { key: index },
            line
          );
        }),
        this.pickAnswerPanel()
      );
    }
  }]);

  return QuestionPanel;
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
