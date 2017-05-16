'use strict';

// Setup the main app page/user-related pages
var setup = function setup(csrf) {
  // Check if the user settings div exists
  var userSettingsDiv = document.querySelector('#userSettings');
  if (userSettingsDiv) {
    ReactDOM.render(React.createElement(UserSettingPanel, { csrf: csrf }), userSettingsDiv);
  }

  // Check if the history div exists
  var historyDiv = document.querySelector('#history');
  if (historyDiv) {
    ReactDOM.render(React.createElement(HistoryPanel, { csrf: csrf }), historyDiv);
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
        { id: 'buildQuizFormPanel', className: 'panel' },
        React.createElement(
          'h1',
          null,
          'Build Your Own'
        ),
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Panel that holds the user's quiz history
var HistoryPanel = function (_React$Component) {
  _inherits(HistoryPanel, _React$Component);

  function HistoryPanel() {
    _classCallCheck(this, HistoryPanel);

    var _this = _possibleConstructorReturn(this, (HistoryPanel.__proto__ || Object.getPrototypeOf(HistoryPanel)).call(this));

    _this.state = {};
    _this.state.data = {};

    _this.loadHistory = _this.loadHistory.bind(_this);
    return _this;
  }

  // When this is rendered, load the history


  _createClass(HistoryPanel, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadHistory();
    }

    // Load history

  }, {
    key: 'loadHistory',
    value: function loadHistory() {
      var _this2 = this;

      sendAjax('GET', '/getHistory', { _csrf: this.props.csrf }).then(function (data) {
        _this2.setState({
          data: {
            owner: data.owner,
            history: data.entries
          }
        });
      });
    }

    // Render history

  }, {
    key: 'render',
    value: function render() {
      var history = this.state.data.history;
      var owner = this.state.data.owner;

      // Check if the account data is loaded
      if (!history || !owner) {
        return React.createElement(
          'div',
          { className: 'panel' },
          'History Not Found'
        );
      }

      var historyNodes = history.map(function (entry, index) {
        var date = new Date(entry.date);
        return React.createElement(
          'div',
          { key: index, className: 'panel' },
          React.createElement(
            'b',
            null,
            date.toLocaleString(),
            ':'
          ),
          ' ',
          entry.quiz,
          ' - ',
          entry.score,
          ' points.'
        );
      });

      /// Render account options 
      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'h2',
          null,
          owner,
          '\'s History'
        ),
        React.createElement('hr', null),
        historyNodes
      );
    }
  }]);

  return HistoryPanel;
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

    _this.loadQuizzes = _this.loadQuizzes.bind(_this);
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
      var _this2 = this;

      // Loads both quiz info and current account info
      $.when(
      // Get info about quizzes - The client gets only what it needs
      sendAjax('GET', '/getQuizzesInfo', { _csrf: this.props.csrf }),
      // Get the current account info - take from what is in session.
      sendAjax('GET', '/getCurrentAccount', { _csrf: this.props.csrf })).done(function (quizzesData, accountData) {
        // Set the state with this data
        _this2.setState({
          data: {
            quizzes: quizzesData[0], // Array of quiz ids
            account: accountData[0].account }
        });
      });
    }

    // Render quiz list

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

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
        if (quiz.isCreation) {
          userQuizNodes.push(React.createElement(QuizPanel, { key: quiz.publicId, index: index, quiz: quiz, onChange: _this3.loadQuizzes, csrf: _this3.props.csrf }));
        } else {
          otherQuizNodes.push(React.createElement(QuizPanel, { key: quiz.publicId, index: index, quiz: quiz, onChange: _this3.loadQuizzes, csrf: _this3.props.csrf }));
        }
      });

      // Render quiz list
      return React.createElement(
        'div',
        { id: 'quizListPanel', className: 'panel' },
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

    var _this = _possibleConstructorReturn(this, (QuizPanel.__proto__ || Object.getPrototypeOf(QuizPanel)).call(this));

    _this.playQuiz = _this.playQuiz.bind(_this);
    _this.viewQuizLeaderboard = _this.viewQuizLeaderboard.bind(_this);
    _this.editQuiz = _this.editQuiz.bind(_this);
    _this.deleteQuiz = _this.deleteQuiz.bind(_this);
    return _this;
  }

  // Request to select and play this panel's quiz


  _createClass(QuizPanel, [{
    key: 'playQuiz',
    value: function playQuiz() {
      sendAjax('GET', '/playQuiz?quiz=' + this.props.quiz.publicId, {
        _csrf: this.props.csrf
      }).then(redirect);
    }
  }, {
    key: 'viewQuizLeaderboard',


    // Request to select and view the quizzes leaderboard
    value: function viewQuizLeaderboard() {
      sendAjax('GET', '/getLeaderboardPage?quiz=' + this.props.quiz.publicId, {
        _csrf: this.props.csrf
      }).then(redirect);
    }
  }, {
    key: 'editQuiz',


    // Request to select and edit this panel's quiz
    value: function editQuiz() {
      sendAjax('GET', '/editQuiz?quiz=' + this.props.quiz.publicId, {
        _csrf: this.props.csrf
      }).then(redirect);
    }
  }, {
    key: 'deleteQuiz',


    // Request to delete and edit this panel's quiz
    value: function deleteQuiz() {
      sendAjax('DELETE', '/deleteQuiz', {
        _csrf: this.props.csrf,
        publicId: this.props.quiz.publicId
      }).then(this.props.onChange);
    }

    // Render quiz panel

  }, {
    key: 'render',
    value: function render() {
      var quiz = this.props.quiz;
      // Print description of quiz.
      var printDescription = function printDescription() {
        if (quiz.description) {
          // Handle line breaks
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

      // Each quiz has different options depend on if it is the creation of the current account
      var quizOptions = quiz.isCreation ? React.createElement(
        'div',
        { className: 'quizOptions' },
        React.createElement(
          'button',
          { className: 'button', onClick: this.playQuiz },
          ' Play Quiz '
        ),
        React.createElement(
          'button',
          { className: 'button', onClick: this.viewQuizLeaderboard },
          ' Leaderboard '
        ),
        React.createElement(
          'button',
          { className: 'button', onClick: this.editQuiz },
          ' Edit Quiz '
        ),
        React.createElement(
          'button',
          { className: 'button', onClick: this.deleteQuiz },
          ' Delete Quiz '
        )
      ) : React.createElement(
        'div',
        { className: 'quizOptions' },
        React.createElement(
          'button',
          { className: 'button', onClick: this.playQuiz },
          ' Play Quiz '
        ),
        React.createElement(
          'button',
          { className: 'button', onClick: this.viewQuizLeaderboard },
          ' Leaderboard '
        )
      );

      // Render quiz panel
      return React.createElement(
        'div',
        { className: 'panel quizPanel' },
        React.createElement(
          'header',
          null,
          React.createElement(
            'h2',
            null,
            ' ',
            quiz.title,
            ' '
          ),
          React.createElement(
            'h3',
            null,
            ' created by ',
            quiz.creator,
            ' '
          )
        ),
        React.createElement(
          'div',
          { className: 'quizDescription' },
          printDescription()
        ),
        quizOptions
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
        { id: 'userSettingsPanel', className: 'panel' },
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
          React.createElement('br', null),
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
