// Panel that holds the list of quizzes
class QuizListPanel extends React.Component {
  // Pre-make data object
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadQuizzes = this.loadQuizzes.bind(this);
  }

  // Loads the quizzes once the object is rendered
  componentDidMount() {
    this.loadQuizzes();
  }

  // Loads data needed to render this object
  loadQuizzes() {
    // Loads both quiz info and current account info
    $.when(
      // Get info about quizzes - The client gets only what it needs
      sendAjax('GET', '/getQuizzesInfo', { _csrf: this.props.csrf }),
      // Get the current account info - take from what is in session.
      sendAjax('GET', '/getCurrentAccount', { _csrf: this.props.csrf })
    ).done((quizzesData, accountData) => {
      // Set the state with this data
      this.setState({
        data: {
          quizzes: quizzesData[0],  // Array of quiz ids
          account: accountData[0].account,  // Current account data
        },
      });
    });
  }

  // Render quiz list
  render() {
    const quizzes = this.state.data.quizzes;  // List of quiz ids
    const account = this.state.data.account;  // The account currently in session
    const userQuizNodes = []; // Quiz Panels for quizzes made by the user
    const otherQuizNodes = [];  // Quiz panels for quizzes made by other users

    // Check if the data is loaded
    if (!quizzes || !account) {
      return (
        <div className="panel">
          <h2>Quizzes not loaded</h2>
        </div>
      )
    };

    // Goes through each quiz
    // Divides them between user made quizzes and those made by other users.
    quizzes.forEach((quiz, index) => {
      if (quiz.isCreation) {
        userQuizNodes.push(
          <QuizPanel key={quiz.publicId} index={index} quiz={quiz} onChange={this.loadQuizzes} csrf={this.props.csrf} />
        );
      } else {
        otherQuizNodes.push(
          <QuizPanel key={quiz.publicId} index={index} quiz={quiz} onChange={this.loadQuizzes} csrf={this.props.csrf} />
        );
      }
    });

    // Render quiz list
    return (
      <div id="quizListPanel" className="panel">
        <h1>Your Quizzes:</h1>
        {/* Check if the user has made any of the quizzes. */}
        {userQuizNodes.length !== 0 ? userQuizNodes : "You have not made any quizzes, yet."}
        <h1>Other Quizzes:</h1>
        {/* Check if other user have made any of the quizzes. */}
        {otherQuizNodes.length !== 0 ? otherQuizNodes : "No other quizzes loaded."}
      </div>
    );
  }
}