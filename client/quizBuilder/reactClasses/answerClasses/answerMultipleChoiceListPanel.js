// Panel that holds the list of answers to multiple choice question
class AnswerMultipleChoiceListPanel extends React.Component {
  // Create initial data
  constructor() {
    super();

    this.addAnswer = this.addAnswer.bind(this);
  }


  // Add an answer to the question
  addAnswer() {
    sendAjax('POST', '/buildAnswer', {
      _csrf: this.props.csrf,
      questionIndex: this.props.index
    }).then(this.props.onChange);
  }

  // Update if answer is correct
  updateCorrectAnswer(answerIndex, isCorrect) {
    sendAjax(
      "PUT",
      '/updateQuestionCorrectAnswer',
      {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        answerIndex,
        isCorrect,
      }).then(this.props.onChange);
  }

  render() {
    const question = this.props.question;
    const answers = question.answers || [];

    if (answers.length == 0) {
      this.addAnswer();
    }

    // Answer panels for each answer id
    const answerNodes = answers.map((answer, index) => {
      // Renders the actual answer
      return (<AnswerMultipleChoicePanel
        key={answer.id}
        questionIndex={this.props.index}
        index={index}
        question={this.props.question}
        answer={answer}
        parent={this}
        onChange={this.props.onChange}
        csrf={this.props.csrf}
      />)
    });

    // Render answers
    return (
      <div>
        {answerNodes}
        <input
          className="quizBuilderButton"
          type="button"
          onClick={this.addAnswer}
          value="Add Answer"
        />
      </div>
    )
  }
}