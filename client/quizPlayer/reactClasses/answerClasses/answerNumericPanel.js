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
          type="number"
          step={0.0001}
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