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
      sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

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
      sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);

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
