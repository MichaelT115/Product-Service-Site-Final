// Panel that holds the list of answers
class AnswerListPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadAnswers = this.loadAnswers.bind(this);
  }

  // Load answer from the server and set the state
  loadAnswers() {
    const self = this;
    this.props.parent.loadAnswers();
  }

  // Add an answer to the question
  addAnswer() {
    const self = this;
    sendAjax('POST', '/buildAnswer', { _csrf: self.props.csrf, questionIndex: self.props.parent.props.index })
      .then(self.loadAnswers.bind(self));
  }

  // Delete answer from question
  deleteAnswer(answerIndex) {
    const self = this;
    sendAjax('DELETE', '/deleteAnswer', {
      _csrf: self.props.csrf,
      questionIndex: self.props.parent.props.index,
      answerIndex: answerIndex,
    })
      .then(self.loadAnswers.bind(self));
  }

  // Update if answer is correct
  updateCorrectAnswer(answerIndex, isCorrect) {
    this.props.parent.updateCorrectAnswer(answerIndex, isCorrect);
  }

  render() {
    const self = this;
    const answers = this.props.answers || [];
    const correctAnswer = this.props.correctAnswer;

    // Answer panels for each answer id
    const answerNodes = answers.map((answer, index) => {
      // Renders the actual answer
      return (
        <AnswerPanel
          key={answer._id}
          index={index}
          parent={self}
          answer={answer}
          isCorrect={index === correctAnswer}
          csrf={self.props.csrf}
        />
      )
    });

    // Render answers
    return (
      <div>
        {answerNodes}
        {/* Add answer when clicked */}
        < input className="quizBuilderButton" type="button" onClick={self.addAnswer.bind(self)} value="Add Answer" />
      </div>
    )
  }
}