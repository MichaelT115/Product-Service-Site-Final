// Panel that holds a single answer to a multiple question
class AnswerMultipleChoicePanel extends React.Component {
  // Render answer
  render() {
    const answer = this.props.answer;
    // Render answer
    return (
      <div className="answerPanel">
        <span>{this.props.index + 1}. </span>
        {/* Onclick submit Answer */}
        <input type="button" className="quizBuilderButton"
          value={_.unescape(answer.content)}
          onClick={() => this.props.submitAnswer(this.props.index)}
        />
      </div>
    )
  }
}