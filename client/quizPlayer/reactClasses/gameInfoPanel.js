// Displays info about the game
class GameInfoPanel extends React.Component {
  // Render game info
  render() {
    const game = this.props.game;
    const quizInfo = this.props.quizInfo;

    // Render game info
    return (
      <div className="questionPanel">
        Question Count:  {quizInfo.questionCount}<br />
        Score: {game.score}<br />
        Question: {game.currentIndex + 1}
      </div>
    )
  }
}