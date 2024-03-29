// Allows the user to input an answer to a text question
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
          id="AnswerText"
          className="questionInput"
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