// Panel that holds an answer to a question
class AnswerMultipleChoicePanel extends React.Component {
  // Render answer
  render() {
    const answer = this.props.answer;
    // Render answer
    return (
      <div className="answerPanel">
        {/* Onclick submit Answer */}
        <input type="button" className="quizBuilderButton"
          value={_.unescape(answer.content)}
          onClick={() => this.props.submitAnswer(this.props.index)}
        />
      </div>
    )
  }
}