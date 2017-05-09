// Panel that holds the game
class GamePanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};
    this.state.game = {
      score: 0,
      currentIndex: 0,
    };
  }

  // When the component is rendered, load quiz and question IDs.
  componentDidMount() {
    const self = this;

    // Load quiz and question IDs
    $.when(
      sendAjax('GET', '/getQuiz', { _csrf: this.props.csrf, }),
      sendAjax('GET', '/getQuestionIds', { _csrf: this.props.csrf, })
    ).done((quizData, questionsData) => {
      // Change state with new data
      self.setState({
        data: {
          quiz: {
            _id: quizData[0].quiz._id,
            name: _.unescape(quizData[0].quiz.name || ""), // Handles escape characters
            description: _.unescape(quizData[0].quiz.description || ""),
          },
          questions: questionsData[0].questionIds
        },
      });
    });
  }

  // Add score to game
  addScore(score) {
    this.state.game.score += score;
    this.setState(this.state.game);
  }

  // Move to next question
  nextQuestion() {
    const game = this.state.game;
    const questions = this.state.data.questions;

    // Change the current question index
    game.currentIndex += 1;
    if (game.currentIndex >= questions.length) {
      game.currentIndex = -1;
    }

    // Update game state
    this.setState(game);
  }

  // Render game
  render() {
    const self = this;
    const questions = this.state.data.questions;
    const quiz = this.state.data.quiz;
    const game = this.state.game;

    // Check if the quiz is loaded
    if (!(quiz && questions)) {
      return (
        <div>Question Not Loaded</div>
      )
    }

    // Check if the game is over, and render the game over screen
    if (game.currentIndex === -1) {
      return (
        <div className="questionPanel">
          Finished!!!<br />
          Your score is: {game.score}
        </div>
      );
    }

    // Render game
    return (
      <div className="questionPanel">
        <GameInfoPanel quiz={this.state.data.quiz} questions={this.state.data.questions} game={this.state.game} />
        <QuestionPanel key={questions[game.currentIndex]._id} index={game.currentIndex + 1} _id={questions[game.currentIndex]._id} parent={self} csrf={self.props.csrf} />
      </div>
    )
  }
}