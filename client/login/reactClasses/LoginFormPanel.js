// Renders the login panel
class LoginFromPanelClass extends React.Component {
  // Handles logging into the app
  handleLogin(e) {
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
  render() {
    return (
      <div className="panel">
        <h1>
          Welcome to QuestionR
        </h1>
        <div>
          <img src="/assets/img/question.jpg" alt="QuestionR Logo" />
        </div>
        <h3>
          Build Quizzes<br />
          Try Quizzes
        </h3>
        <div id="errorMessage"></div>
        <form id="loginForm"
          name="loginForm"
          onSubmit={this.handleLogin}
          action="/login"
          method="POST"
          className="mainForm"
        >
          <div>
            <label htmlFor="username">Username</label><br />
            <input id="username" type="text" name="username" placeholder="Username" />
          </div>
          <div>
            <label htmlFor="pass">Password</label><br />
            <input id="password" type="password" name="pass" placeholder="Password" />
          </div>
          <input type="hidden" name="_csrf" value={this.props.csrf} />
          <input className="button" type="submit" value="Log In" />
        </form>
      </div>
    );
  }
}