// Panel that holds the list of answers to the question
class AnswerMultipleChoiceListPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadAnswers = this.loadAnswers.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  // When this component is rendered, load the answers
  componentDidMount() {
    this.loadAnswers();
  }

  // Request answer IDs
  loadAnswers() {
    sendAjax('GET', `/getAnswers?question=${this.props.index}`, { _csrf: this.props.csrf, })
      .then((answers) => {
        this.setState({
          data: { answers },
        });
      });
  }

  // Submit answer to the question
  submitAnswer(answer) {
    sendAjax(
      'GET',
      `/getIsCorrectAnswer?question=${this.props.index}&answer=${answer}`,
      { _csrf: this.props.csrf, }
    ).then((data) => {
      data.isCorrect ? this.props.onCorrectAnswer() : this.props.onWrongAnswer();
    });
  }

  // Render answers
  render() {
    const answers = this.state.data.answers

    // Check if the answer IDs are loaded
    if (!answers) {
      return <div>Answers not loaded</div>
    }

    // Create answer panels
    const answerNodes = answers.map((answer, index) => {
      // Render the answer itself
      return (
        <AnswerMultipleChoicePanel
          key={answer.id}
          index={index}
          answer={answer}
          submitAnswer={this.submitAnswer}
          csrf={this.props.csrf}
        />
      )
    });

    // Render
    return (
      <div>
        {answerNodes}
      </div>
    )
  }
}