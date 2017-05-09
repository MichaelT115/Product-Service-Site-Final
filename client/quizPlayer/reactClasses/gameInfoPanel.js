class GameInfoPanel extends React.Component {
  // Render game info
  render() {
    const self = this;

    // Check if data is loaded.
    if (!(self.props.quiz && self.props.questions && self.props.game)) {
      return (
        <div>Quiz Info Not Loaded</div>
      )
    }

    // Render game info
    return (
      <div className="questionPanel">
        Number of Questions:  {this.props.questions.length}<br />
        Score: {this.props.game.score}<br />
        Question: {this.props.game.currentIndex + 1}
      </div>
    )
  }
}