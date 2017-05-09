// Panel that holds the current question
class QuestionPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};
  }

  // When the component is loaded, load the question
  componentDidMount() {
    const self = this;
    sendAjax('GET', `/getQuestion?questionId=${this.props._id}`, { _csrf: this.props.csrf })
      .then(this.updateStateQuestion.bind(self));
  }

  // Update the state with the question
  updateStateQuestion(response) {
    const question = response.question;

    this.setState({
      data: {
        question: {
          title: _.unescape(question.title),
          description: _.unescape(question.description),
          correctAnswer: question.correctAnswer,
        }
      }
    });
  }

  // Submit answer
  submitAnswer(answerId) {
    // Check if the answer is correct
    const isCorrect = answerId === this.state.data.question.correctAnswer;

    if (isCorrect) {
      this.props.parent.addScore(100);
      this.props.parent.nextQuestion();
    } else {
      this.props.parent.addScore(-25);
    }

    return isCorrect;
  }

  // Render question
  render() {
    const self = this;
    const question = this.state.data.question;

    // Check if the question is loaded
    if (!question) {
      return (<div>Question Not Loaded</div>);
    }

    /// Render question
    return (
      <div className="questionPanel">
        {this.props.index}. {question.title}
        {
          // Make sure there are line breaks. Based off: http://stackoverflow.com/questions/35351706/how-to-render-a-multi-line-text-string-in-react
          question.description.split("\n").map((line, index) => {
            return <p key={index}>{line}</p>;
          })
        }
        {/* Render list of answers */}
        <AnswerListPanel _id={this.props._id} parent={self} correctAnswer={question.correctAnswer} csrf={this.props.csrf} />
      </div>
    )
  }
}