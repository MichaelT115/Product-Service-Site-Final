// Panel that holds an answer to a question
class AnswerPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};
  }

  // After the component is rendered, load the answer data
  componentDidMount() {
    const self = this;
    sendAjax('GET', `/getAnswer?answerId=${this.props._id}`, { _csrf: self.props.csrf })
      .then(self.updateState.bind(self));
  }

  // Update the answer data
  updateState(response) {
    this.setState({
      data: {
        answer: response.answer,
      }
    });
  }

  // Render answer
  render() {
    const self = this;
    const answer = self.state.data.answer;

    // Check if the answer is loaded
    if (!answer) {
      return (
        <div> Answer Not Loaded</div>
      )
    }

    // Render answer
    return (
      <div className="answerPanel">
        {/* Onclick submit Answer */}
        <input type="button" className="quizBuilderButton"
          value={answer.content}
          onClick={
            () => {
              self.props.parent.submitAnswer(self.props._id);
            }
          }
        />
      </div>
    )
  }
}