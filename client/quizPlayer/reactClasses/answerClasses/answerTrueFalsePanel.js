class AnswerTrueFalsePanel extends React.Component {
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
      `/getIsAnswerIsTrue?question=${this.props.index}&answer=${answer}`,
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
        <div className="answerPanel">
          <input type="button" className="quizBuilderButton"
            value={"✔ TRUE"}
            onClick={() => this.submitAnswer(true)}
          />
        </div>
        <div className="answerPanel">
          <input type="button" className="quizBuilderButton"
            value={"✘ FALSE"}
            onClick={() => this.submitAnswer(false)}
          />
        </div>
      </div>
    )
  }
}