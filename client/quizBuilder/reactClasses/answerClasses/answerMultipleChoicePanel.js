// Panel that holds an answer to the question
class AnswerMultipleChoicePanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.updateAnswer = this.updateAnswer.bind(this);
    this.deleteAnswer = this.deleteAnswer.bind(this);
  }

  // Update this answer
  updateAnswer(content) {
    sendAjax(
      "PUT",
      '/updateAnswer',
      {
        _csrf: this.props.csrf,
        questionIndex: this.props.questionIndex,
        answerIndex: this.props.index,
        content,
      }
    ).then(setMessageSaved)
  }

  // Delete answer from question
  deleteAnswer() {
    sendAjax('DELETE', '/deleteAnswer', {
      _csrf: this.props.csrf,
      questionIndex: this.props.questionIndex,
      answerIndex: this.props.index,
    }).then(this.props.onChange);
  }


  // Render answer
  render() {
    const answer = this.props.answer;
    const answerContentId = `answerContent_a${this.props.index}_q${this.props.questionIndex}`;

    // Updates the answer after the user has stopped typing for half a second.
    const answerUpdater =
      new DelayUpdateHandler(
        500,
        () => {
          this.updateAnswer($(`#${answerContentId}`).val())
        },
        setMessageSaving
      );

    // Final render
    return (
      <div className="answerPanel">
        {/* On click change answer correctness */}
        <input type="button" className="quizBuilderButton"
          value={
            // Set the change correctness button icon
            this.props.question.correctAnswerIndex == this.props.index ? "✔" : "✘"
          }
          onClick={
            // Change the answer correctness
            () => this.props.parent.updateCorrectAnswer(this.props.index, !this.props.isCorrect)
          }
        />
        <input id={answerContentId} className="questionTitle" type="text" name="content"
          defaultValue={_.unescape(answer.content || "")}
          placeholder="Enter Answer"
          size={answer.content ? answer.content.length || 10 : 10}
          onChange={
            (e) => {
              // Set size of info field
              e.target.size = e.target.value.length || 10;
              // Update answer
              answerUpdater.update();
            }
          }
        />
        {/* On click delete answer*/}
        <input type="button" className="quizBuilderButton" value="Delete Answer"
          onClick={this.deleteAnswer}
        />
      </div>
    )
  }
}