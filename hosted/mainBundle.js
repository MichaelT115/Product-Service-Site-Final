'use strict';

// Setup the main app page/user settings page
var setup = function setup(csrf) {
  // Check if the user settings div exists
  var userSettingsDiv = document.querySelector('#userSettings');
  if (userSettingsDiv) {
    ReactDOM.render(React.createElement(UserSettingPanel, { csrf: csrf }), userSettingsDiv);
  }

  // Check if the build quiz form div  exists
  var buildQuizDiv = document.querySelector('#buildQuiz');
  if (buildQuizDiv) {
    ReactDOM.render(React.createElement(BuildQuizPanel, { csrf: csrf }), buildQuizDiv);
  }

  // Check if the quiz list div exists
  var quizListDiv = document.querySelector('#quizList');
  if (quizListDiv) {
    ReactDOM.render(React.createElement(QuizListPanel, { csrf: csrf }), quizListDiv);
  }
};

// Get csrf and begin setup
var getToken = function getToken() {
  sendAjax('GET', '/getToken').then(function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(getToken);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// The panel that holds Build Quiz form.
var BuildQuizPanel = function (_React$Component) {
  _inherits(BuildQuizPanel, _React$Component);

  function BuildQuizPanel() {
    _classCallCheck(this, BuildQuizPanel);

    return _possibleConstructorReturn(this, (BuildQuizPanel.__proto__ || Object.getPrototypeOf(BuildQuizPanel)).apply(this, arguments));
  }

  _createClass(BuildQuizPanel, [{
    key: 'submitQuiz',

    // Handles when the submit quiz button is used.
    value: function submitQuiz(e) {
      e.preventDefault();

      // Check if the name is given
      if ($('#buildQuizName').val() === '') {
        handleError('Title required.');
        return false;
      }

      // Send build quiz request
      sendAjax('POST', $('#quizForm').attr('action'), $('#quizForm').serialize(), redirect);

      return false;
    }

    // Render the panel

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'form',
          {
            id: 'quizForm',
            name: 'quizForm',
            onSubmit: this.submitQuiz,
            action: '/buildQuiz',
            method: 'POST'
          },
          React.createElement(
            'label',
            { htmlFor: 'name' },
            ' Title: '
          ),
          React.createElement('input', { id: 'buildQuizName', type: 'text', name: 'title', placeholder: 'Quiz Title' }),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
          React.createElement('input', { type: 'submit', value: 'Create Quiz' })
        ),
        React.createElement('div', { id: 'errorMessage' })
      );
    }
  }]);

  return BuildQuizPanel;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds the list of quizzes
var QuizListPanel = function (_React$Component) {
  _inherits(QuizListPanel, _React$Component);

  // Pre-make data object
  function QuizListPanel() {
    _classCallCheck(this, QuizListPanel);

    var _this = _possibleConstructorReturn(this, (QuizListPanel.__proto__ || Object.getPrototypeOf(QuizListPanel)).call(this));

    _this.state = {};
    _this.state.data = {};
    return _this;
  }

  // Loads the quizzes once the object is rendered


  _createClass(QuizListPanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadQuizzes();
    }

    // Loads data needed to render this object

  }, {
    key: 'loadQuizzes',
    value: function loadQuizzes() {
      var self = this;

      // Loads both quiz info and current account info
      $.when(
      // Get quiz ids
      sendAjax('GET', '/getQuizzes', { _csrf: this.props.csrf }),
      // Get the current account info - take from what is in session.
      sendAjax('GET', '/getCurrentAccount', { _csrf: this.props.csrf })).done(function (quizzesData, accountData) {
        // Set the state with this data
        self.setState({
          data: {
            quizzes: quizzesData[0].quizzes, // Array of quiz ids
            account: accountData[0].account }
        });
      });
    }

    // Delete a quiz

  }, {
    key: 'deleteQuiz',
    value: function deleteQuiz(questionId) {
      var self = this;
      // Sends delete request
      sendAjax('DELETE', '/deleteQuiz', { _csrf: this.props.csrf, _id: questionId }).then(self.loadQuizzes); // Reload the quiz data
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var self = this;
      var quizzes = this.state.data.quizzes; // List of quiz ids
      var account = this.state.data.account; // The account currently in session
      var userQuizNodes = []; // Quiz Panels for quizzes made by the user
      var otherQuizNodes = []; // Quiz panels for quizzes made by other users

      // Check if the data is loaded
      if (!quizzes || !account) {
        return React.createElement(
          'div',
          { className: 'panel' },
          React.createElement(
            'h2',
            null,
            'Quizzes not loaded'
          )
        );
      };

      // Goes through each quiz
      // Divides them between user made quizzes and those made by other users.
      quizzes.forEach(function (quiz, index) {
        if (quiz.creator === _this2.state.data.account._id) {
          userQuizNodes.push(React.createElement(QuizPanel, { key: quiz._id, index: index + 1, quiz: quiz, parent: self, csrf: self.props.csrf, isUser: true }));
        } else {
          otherQuizNodes.push(React.createElement(QuizPanel, { key: quiz._id, index: index + 1, quiz: quiz, parent: self, csrf: self.props.csrf, isUser: false }));
        }
      });

      // Render quiz list
      return React.createElement(
        'div',
        { className: 'quizList' },
        React.createElement(
          'h1',
          null,
          'Your Quizzes:'
        ),
        userQuizNodes.length !== 0 ? userQuizNodes : "You have not made any quizzes, yet.",
        React.createElement(
          'h1',
          null,
          'Other Quizzes:'
        ),
        otherQuizNodes.length !== 0 ? otherQuizNodes : "No other quizzes loaded."
      );
    }
  }]);

  return QuizListPanel;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds information and options for a quiz
var QuizPanel = function (_React$Component) {
  _inherits(QuizPanel, _React$Component);

  function QuizPanel() {
    _classCallCheck(this, QuizPanel);

    return _possibleConstructorReturn(this, (QuizPanel.__proto__ || Object.getPrototypeOf(QuizPanel)).apply(this, arguments));
  }

  _createClass(QuizPanel, [{
    key: 'render',
    value: function render() {
      var quiz = this.props.quiz; // Quiz is a property used when this react object is created
      var self = this;

      // Request to select and play this panel's quiz
      var playQuiz = function playQuiz() {
        sendAjax('POST', '/playQuiz', {
          _csrf: self.props.csrf,
          quizId: quiz._id
        }, redirect);
      };

      // Request to select and edit this panel's quiz
      var editQuiz = function editQuiz() {
        sendAjax('POST', '/editQuiz', {
          _csrf: self.props.csrf,
          quizId: quiz._id
        }, redirect);
      };

      // Request to delete and edit this panel's quiz
      var deleteQuiz = function deleteQuiz() {
        sendAjax('DELETE', '/deleteQuiz', {
          _csrf: self.props.csrf,
          quizId: quiz._id
        }, function () {
          self.props.parent.loadQuizzes();
        });
      };

      // Print description of quiz.
      var printDescription = function printDescription() {
        if (quiz.description) {
          var lines = quiz.description.split("\n").map(function (line, index) {
            return React.createElement(
              'p',
              { key: index },
              line
            );
          });
          return lines;
        }
        return React.createElement(
          'div',
          null,
          'No Description'
        );
      };

      // Print the options for the quiz
      var printOptions = function printOptions() {
        // Returns a different set option depending if the quiz belongs to the user.
        return self.props.isUser ? React.createElement(
          'div',
          { className: 'quizOptions' },
          React.createElement(
            'button',
            { className: 'makeDomoSubmit', onClick: playQuiz },
            ' Play Quiz '
          ),
          React.createElement(
            'button',
            { className: 'makeDomoSubmit', onClick: editQuiz },
            ' Edit Quiz '
          ),
          React.createElement(
            'button',
            { className: 'makeDomoSubmit', onClick: deleteQuiz },
            ' Delete Quiz '
          )
        ) : React.createElement(
          'div',
          { className: 'quizOptions' },
          React.createElement(
            'button',
            { className: 'makeDomoSubmit', onClick: playQuiz },
            ' Play Quiz '
          )
        );
      };

      // Render quiz panel
      return React.createElement(
        'div',
        { className: 'panel quizListPanel' },
        React.createElement(
          'h2',
          null,
          ' Name: ',
          quiz.name,
          ' '
        ),
        React.createElement(
          'h3',
          null,
          ' Description: '
        ),
        React.createElement(
          'div',
          null,
          printDescription()
        ),
        printOptions()
      );
    }
  }]);

  return QuizPanel;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds settings for the user to edit
var UserSettingPanel = function (_React$Component) {
  _inherits(UserSettingPanel, _React$Component);

  function UserSettingPanel() {
    _classCallCheck(this, UserSettingPanel);

    var _this = _possibleConstructorReturn(this, (UserSettingPanel.__proto__ || Object.getPrototypeOf(UserSettingPanel)).call(this));

    _this.state = {};
    // Pre-make data object
    _this.state.data = {};
    return _this;
  }

  // When this is rendered, load the account


  _createClass(UserSettingPanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadAccount();
    }

    // Load account data  

  }, {
    key: 'loadAccount',
    value: function loadAccount() {
      var self = this;
      sendAjax('GET', '/getCurrentAccount', { _csrf: this.props.csrf }).then(function (data) {
        self.setState({
          data: {
            account: data.account
          }
        });
      });
    }

    // Update the user name

  }, {
    key: 'updateUsername',
    value: function updateUsername(e) {
      e.preventDefault();

      // Check if a new username is entered.
      if ($('#user').val() == '') {
        handleError('Enter new username');
        return false;
      }

      // Send update request
      sendAjax('PUT', $('#usernameForm').attr('action'), $('#usernameForm').serialize(), redirect);

      return false;
    }
  }, {
    key: 'updatePassword',


    // Update the user's password
    value: function updatePassword(e) {
      e.preventDefault();

      // Check the password fields
      if ($('#password').val() === '' || $('#password2').val() === '') {
        handleError('All fields are required.');
        return false;
      }

      // Check if the passwords are equal
      if ($('#password').val() !== $('#password2').val()) {
        handleError('Make sure the password fields match.');
        return false;
      }

      // Send updated password request
      sendAjax('PUT', $('#passwordForm').attr('action'), $('#passwordForm').serialize(), redirect);

      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      var account = this.state.data.account;

      // Check if the account data is loaded
      if (!account) {
        return React.createElement(
          'div',
          { className: 'panel' },
          'Loading Account Info'
        );
      }

      /// Render account options 
      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'h2',
          null,
          'Username: ',
          account.username
        ),
        React.createElement('hr', null),
        React.createElement(
          'form',
          {
            id: 'usernameForm',
            onSubmit: this.updateUsername,
            action: '/updateUsername',
            method: 'PUT'
          },
          React.createElement(
            'label',
            { htmlFor: 'name' },
            'Change Username'
          ),
          React.createElement('br', null),
          React.createElement('input', { id: 'user', type: 'text', name: 'user', placeholder: 'New User Name' }),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
          React.createElement('input', { type: 'submit', value: 'Change Username' })
        ),
        React.createElement(
          'form',
          {
            id: 'passwordForm',
            onSubmit: this.updatePassword,
            action: '/updatePassword',
            method: 'PUT'
          },
          React.createElement(
            'label',
            { htmlFor: 'name' },
            'Change Password'
          ),
          React.createElement('br', null),
          React.createElement('input', { id: 'password', type: 'text', name: 'password', placeholder: 'New Password' }),
          React.createElement('br', null),
          React.createElement('input', { id: 'password2', type: 'text', name: 'password2', placeholder: 'Repeat New Password' }),
          React.createElement('br', null),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
          React.createElement('input', { type: 'submit', value: 'Change Password' })
        ),
        React.createElement('div', { id: 'errorMessage' })
      );
    }
  }]);

  return UserSettingPanel;
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
