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
    const self = this;

    // Loads both quiz info and current account info
    $.when(
      sendAjax('GET', '/getQuizzesInfo', { _csrf: this.props.csrf }),
      // Get the current account info - take from what is in session.
      sendAjax('GET', '/getCurrentAccount', { _csrf: this.props.csrf })
    ).done((quizzesData, accountData) => {
      // Set the state with this data
      self.setState({
        data: {
          quizzes: quizzesData[0],  // Array of quiz ids
          account: accountData[0].account,  // Current account data
        },
      });
    });
  }

  render() {
    const self = this;
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
          <QuizPanel key={quiz.publicId} index={index} quiz={quiz} onChange={self.loadQuizzes} csrf={self.props.csrf} />
        );
      } else {
        otherQuizNodes.push(
          <QuizPanel key={quiz.publicId} index={index} quiz={quiz} onChange={self.loadQuizzes} csrf={self.props.csrf} />
        );
      }
    });

    // Render quiz list
    return (
      <div className="quizList">
        <h1>Your Quizzes:</h1>
        {userQuizNodes.length !== 0 ? userQuizNodes : "You have not made any quizzes, yet."}
        <h1>Other Quizzes:</h1>
        {otherQuizNodes.length !== 0 ? otherQuizNodes : "No other quizzes loaded."}
      </div>
    );
  }
}