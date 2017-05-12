class AnswerTextPanel extends React.Component {
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
      `/getIsAnswerText?question=${this.props.index}&answer=${answer}`,
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
          id="AnswerText"
          type="text"
        />
        <input
          type="button"
          className="quizBuilderButton"
          value="Submit Text"
          onClick={() => this.submitAnswer($("#AnswerText").val())}
        />
      </div>
    )
  }
}