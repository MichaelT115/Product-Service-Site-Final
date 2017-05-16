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
    this.state.ad = {};

    this.loadQuizInfo = this.loadQuizInfo.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.addScore = this.addScore.bind(this);
    this.onFinished = this.onFinished.bind(this);
  }

  // When the component is rendered, load quiz and question IDs.
  componentDidMount() {
    this.loadQuizInfo();
  }

  loadQuizInfo() {
    sendAjax('GET', '/getQuizInfo')
      .then((quizInfo) => {
        // Set state of quiz
        this.setState({
          data: {
            quizInfo
          },
          ad: {
            hasSeenAd: false,
            adIndex: Math.round(Math.random() * quizInfo.questionCount),
          }
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
    const questionCount = this.state.data.quizInfo.questionCount;

    // Change the current question index
    game.currentIndex += 1;
    if (game.currentIndex >= questionCount) {
      this.onFinished();
    }

    // Update game state
    this.setState(game);
  }

  // Handles what happen when the user finishes the game
  onFinished() {
    this.state.game.currentIndex = -1;
    sendAjax('POST', '/addLeaderboardEntry', { _csrf: this.props.csrf, score: this.state.game.score });
    sendAjax('POST', '/addHistoryEntry', { _csrf: this.props.csrf, score: this.state.game.score });
  }

  // Render game
  render() {
    const self = this;
    const quizInfo = this.state.data.quizInfo;
    const game = this.state.game;

    if (!quizInfo) {
      return <div>Test</div>
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

    // Render advertising
    if (!this.state.ad.hasSeenAd && game.currentIndex === this.state.ad.adIndex)
      return (
        <div className="questionPanel">
          <h1>ADVERTISEMENT</h1>
          <img className="ad" src="assets/ads/Domomaker.png" alt="Put your add here" />
          <br />
          <input type="button" className="quizBuilderButton"
            value={"Next"}
            onClick={() => this.setState({ ad: { hasSeenAd: false } })}
          />
        </div>
      )

    // Render game
    return (
      <div className="questionPanel">
        <GameInfoPanel quizInfo={quizInfo} game={game} />
        <QuestionPanel
          key={game.currentIndex}
          quizInfo={quizInfo}
          game={game}
          nextQuestion={this.nextQuestion}
          addScore={this.addScore}
        />
      </div>
    )
  }
}