// Panel that holds the list of answers to the question
class AnswerListPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};
  }

  // When this component is rendered, load the answers
  componentDidMount() {
    this.loadAnswers();
  }

  // Request answer IDs
  loadAnswers() {
    const self = this;
    sendAjax('GET', `/getAnswerIds?questionId=${this.props._id}`, { _csrf: this.props.csrf, })
      .then((data) => {
        self.setState({
          data: { answerIds: data.answerIds },
        });
      });
  }

  // Submit answer to the question
  submitAnswer(answerId) {
    this.props.parent.submitAnswer(answerId);
  }

  // Render answers
  render() {
    const self = this;
    const answerIds = this.state.data.answerIds

    // Check if the answer IDs are loaded
    if (!answerIds) {
      return <div>Answers not loaded</div>
    }

    // Create answer panels
    const answerNodes = answerIds.map((answerId, index) => {
      // Render the answer itself
      return (
        <AnswerPanel key={answerId._id} index={index + 1} _id={answerId._id} parent={self} isCorrect={answerId._id === this.props.correctAnswer} csrf={self.props.csrf} />
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