"use strict";

// Render log in window
var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginFromPanelClass, { csrf: csrf }), document.querySelector("#content"));
};

// Render sign up window
var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignUpFromPanelClass, { csrf: csrf }), document.querySelector("#content"));
};

// Set up login and sing up buttons to create related windows
var setup = function setup(csrf) {
  var loginButton = document.querySelector('#loginButton');
  var signupButton = document.querySelector('#signupButton');

  // Signup button renders sign up window
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  // Login button renders login window
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); // Default view
};

/// Get csrf and begin setup
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

// Renders the login panel
var LoginFromPanelClass = function (_React$Component) {
  _inherits(LoginFromPanelClass, _React$Component);

  function LoginFromPanelClass() {
    _classCallCheck(this, LoginFromPanelClass);

    return _possibleConstructorReturn(this, (LoginFromPanelClass.__proto__ || Object.getPrototypeOf(LoginFromPanelClass)).apply(this, arguments));
  }

  _createClass(LoginFromPanelClass, [{
    key: 'handleLogin',

    // Handles logging into the app
    value: function handleLogin(e) {
      e.preventDefault();

      if ($('#username').val() == '' || $('#password').val() == '') {
        handleError('You need to fill in both the Username and Password.');
        return false;
      }

      // Sends login request to server.
      sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize()).then(redirect);

      return false;
    }

    // Render login panel

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'h1',
          null,
          'Welcome to QuestionR'
        ),
        React.createElement(
          'div',
          null,
          React.createElement('img', { src: '/assets/img/question.jpg', alt: 'QuestionR Logo' })
        ),
        React.createElement(
          'h3',
          null,
          'Build Quizzes',
          React.createElement('br', null),
          'Try Quizzes'
        ),
        React.createElement('div', { id: 'errorMessage' }),
        React.createElement(
          'form',
          { id: 'loginForm',
            name: 'loginForm',
            onSubmit: this.handleLogin,
            action: '/login',
            method: 'POST',
            className: 'mainForm'
          },
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'username' },
              'Username'
            ),
            React.createElement('br', null),
            React.createElement('input', { id: 'username', type: 'text', name: 'username', placeholder: 'Username' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'pass' },
              'Password'
            ),
            React.createElement('br', null),
            React.createElement('input', { id: 'password', type: 'password', name: 'pass', placeholder: 'Password' })
          ),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
          React.createElement('input', { className: 'button', type: 'submit', value: 'Log In' })
        )
      );
    }
  }]);

  return LoginFromPanelClass;
}(React.Component);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Renders the signup panel
var SignUpFromPanelClass = function (_React$Component) {
  _inherits(SignUpFromPanelClass, _React$Component);

  function SignUpFromPanelClass() {
    _classCallCheck(this, SignUpFromPanelClass);

    return _possibleConstructorReturn(this, (SignUpFromPanelClass.__proto__ || Object.getPrototypeOf(SignUpFromPanelClass)).apply(this, arguments));
  }

  _createClass(SignUpFromPanelClass, [{
    key: 'handleSignup',

    // Handles signing up for the app
    value: function handleSignup(e) {
      e.preventDefault();

      // Makes sure the fields are filled
      if ($('#user').val() == '' || $('#password').val() == '' || $('#password2').val() == '') {
        handleError('All fields are required.');
        return false;
      }

      // Checks if the passwords are the same
      if ($('#password').val() !== $('#password2').val()) {
        handleError('Make sure the password fields match.');
        return false;
      }

      // Send sign up request to server
      sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize()).then(redirect);

      return false;
    }
  }, {
    key: 'render',


    // Render login panel  
    value: function render() {
      return React.createElement(
        'div',
        { className: 'panel' },
        React.createElement(
          'h1',
          null,
          'Sign Up for QuestionR'
        ),
        React.createElement(
          'div',
          null,
          React.createElement('img', { src: '/assets/img/question.jpg', alt: 'QuestionR Logo' })
        ),
        React.createElement(
          'h3',
          null,
          'Build Quizzes',
          React.createElement('br', null),
          'Try Quizzes'
        ),
        React.createElement('div', { id: 'errorMessage' }),
        React.createElement(
          'form',
          { id: 'signupForm',
            name: 'signupForm',
            onSubmit: this.handleSignup,
            action: '/signup',
            method: 'POST',
            className: 'mainForm'
          },
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'username' },
              'Username'
            ),
            React.createElement('br', null),
            React.createElement('input', { id: 'username', type: 'text', name: 'username', placeholder: 'Username' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { htmlFor: 'pass' },
              'Password'
            ),
            React.createElement('br', null),
            React.createElement('input', { id: 'password', type: 'password', name: 'pass', placeholder: 'Password' }),
            React.createElement('br', null),
            React.createElement('input', { id: 'password2', type: 'password', name: 'pass2', placeholder: 'Repeat Password' })
          ),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
          React.createElement('input', { className: 'button', type: 'submit', value: 'Sign Up' })
        )
      );
    }
  }]);

  return SignUpFromPanelClass;
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
