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
      var self = this;

      // Loads both quiz info and current account info
      $.when(sendAjax('GET', '/getQuizzesInfo', { _csrf: this.props.csrf }),
      // Get the current account info - take from what is in session.
      sendAjax('GET', '/getCurrentAccount', { _csrf: this.props.csrf })).done(function (quizzesData, accountData) {
        // Set the state with this data
        self.setState({
          data: {
            quizzes: quizzesData[0], // Array of quiz ids
            account: accountData[0].account }
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
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
        if (quiz.isCreation) {
          userQuizNodes.push(React.createElement(QuizPanel, { key: quiz.publicId, index: index, quiz: quiz, onChange: self.loadQuizzes, csrf: self.props.csrf }));
        } else {
          otherQuizNodes.push(React.createElement(QuizPanel, { key: quiz.publicId, index: index, quiz: quiz, onChange: self.loadQuizzes, csrf: self.props.csrf }));
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

    var _this = _possibleConstructorReturn(this, (QuizPanel.__proto__ || Object.getPrototypeOf(QuizPanel)).call(this));

    _this.playQuiz = _this.playQuiz.bind(_this);
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
  }, {
    key: 'render',
    value: function render() {
      var quiz = this.props.quiz;
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

      var quizOptions = quiz.isCreation ? React.createElement(
        'div',
        { className: 'quizOptions' },
        React.createElement(
          'button',
          { className: 'makeDomoSubmit', onClick: this.playQuiz },
          ' Play Quiz '
        ),
        React.createElement(
          'button',
          { className: 'makeDomoSubmit', onClick: this.editQuiz },
          ' Edit Quiz '
        ),
        React.createElement(
          'button',
          { className: 'makeDomoSubmit', onClick: this.deleteQuiz },
          ' Delete Quiz '
        )
      ) : React.createElement(
        'div',
        { className: 'quizOptions' },
        React.createElement(
          'button',
          { className: 'makeDomoSubmit', onClick: this.playQuiz },
          ' Play Quiz '
        )
      );

      // Render quiz panel
      return React.createElement(
        'div',
        { className: 'panel quizListPanel' },
        React.createElement(
          'h2',
          null,
          ' ',
          quiz.title,
          ' '
        ),
        React.createElement(
          'div',
          null,
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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AutoExpandTextArea = function (_React$Component) {
  _inherits(AutoExpandTextArea, _React$Component);

  function AutoExpandTextArea() {
    _classCallCheck(this, AutoExpandTextArea);

    var _this = _possibleConstructorReturn(this, (AutoExpandTextArea.__proto__ || Object.getPrototypeOf(AutoExpandTextArea)).call(this));

    _this.updateSize = _this.updateSize.bind(_this);
    $(window).resize(_this.updateSize);
    return _this;
  }

  _createClass(AutoExpandTextArea, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      setTimeout(function () {
        window.requestAnimationFrame(_this2.updateSize);
      }, 0);
    }
  }, {
    key: "updateSize",
    value: function updateSize() {
      var textArea = $("#" + this.props.id)[0];
      textArea.style.height = '0px';
      textArea.style.height = textArea.scrollHeight + 5 + "px";
    }
  }, {
    key: "render",
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
          _this3.updateSize();
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
        size: this.props.defaultValue ? this.props.defaultValue.length : this.props.placeholder ? this.props.placeholder.length : 0,
        placeholder: this.props.placeholder,
        defaultValue: this.props.defaultValue,
        onChange: function onChange(e) {
          // Update length of field
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

    this.timer = {}; // time out handler
    this.timeDelay = timeDelay; // The time in milliseconds before the time out
    this.onUpdate = onUpdate;
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

      if (this.onUpdate) {
        this.onUpdate();
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

var createQuizURL = function createQuizURL(publicId) {
  return window.location.host + '/quizPlayer?quiz=' + publicId;
};

var setMessageSaving = function setMessageSaving() {
  $('#quizSaveMessage').text('Saving...');
};

var setMessageSaved = function setMessageSaved() {
  $('#quizSaveMessage').text('Database Up-To-Date');
};
