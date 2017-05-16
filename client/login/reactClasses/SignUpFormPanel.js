// Renders the signup panel
class SignUpFromPanelClass extends React.Component {
  // Handles signing up for the app
  handleSignup(e) {
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
    sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize())
      .then(redirect);

    return false;
  };

  // Render login panel  
  render() {
    return (
      <div className="panel">
        <h1>
          Sign Up for QuestionR
        </h1>
        <div>
          <img src="/assets/img/question.jpg" alt="QuestionR Logo" />
        </div>
        <h3>
          Build Quizzes<br />
          Try Quizzes
        </h3>
        {/* Handles error messages */}
        <div id="errorMessage"></div>
        {/* Sign up form */}
        <form id="signupForm"
          name="signupForm"
          onSubmit={this.handleSignup}
          action="/signup"
          method="POST"
          className="mainForm"
        >
          <div>
            <label htmlFor="username">Username</label><br />
            <input id="username" type="text" name="username" placeholder="Username" />
          </div>
          <div>
            <label htmlFor="pass">Password</label><br />
            <input id="password" type="password" name="pass" placeholder="Password" /><br />
            <input id="password2" type="password" name="pass2" placeholder="Repeat Password" />
          </div>
          <input type="hidden" name="_csrf" value={this.props.csrf} />
          <input className="button" type="submit" value="Sign Up" />
        </form>
      </div>
    );
  }
}