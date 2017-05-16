// Allows the user to input an answer to a numeric question
class AnswerNumericPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.submitAnswer = this.submitAnswer.bind(this);
  }

  // Submit answer to the question
  submitAnswer(answer) {
    sendAjax(
      'GET',
      `/getIsAnswerNumeric?question=${this.props.index}&answer=${answer}`,
      { _csrf: this.props.csrf, }
    ).then((data) => {
      // Handles if the answer is correct or not.
      data.isCorrect ? this.props.onCorrectAnswer() : this.props.onWrongAnswer();
    });
  }

  // Render answers
  render() {
    // Render
    return (
      <div>
        Answer:
        <input
          id="AnswerNumber"
          className="questionInput questionInputNumeric"
          type="number"
          step={0.1}
        />
        <input
          type="button"
          className="quizBuilderButton"
          value="Submit Number"
          onClick={() => this.submitAnswer($("#AnswerNumber").val())}
        />
      </div>
    )
  }
}