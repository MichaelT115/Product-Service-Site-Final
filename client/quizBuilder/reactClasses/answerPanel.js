// Panel that holds an answer to the question
class AnswerPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};
  }

  // Update this answer
  updateAnswer(content) {
    const self = this;
    sendAjax(
      "PUT",
      '/updateAnswer',
      {
        _csrf: self.props.csrf,
        questionIndex: self.props.parent.props.parent.props.index,
        answerIndex: self.props.index,
        content,
      }
    );
  }

  // Render answer
  render() {
    const answer = this.props.answer;
    const answerContentId = `answerContent_a${this.props.index}_q${this.props.parent.props.parent.props.index}`;

    // Check if the answer is loaded
    if (!answer) {
      return (
        <div> Answer Not Loaded</div>
      )
    }

    // Updates the answer after the user has stopped typing for half a second.
    const answerUpdater =
      new DelayUpdateHandler(
        500,
        () => {
          this.updateAnswer($(`#${answerContentId}`).val())
        }
      );

    // Final render
    return (
      <div className="answerPanel">
        {/* On click change answer correctness */}
        <input type="button" className="quizBuilderButton"
          value={
            // Set the change correctness button icon
            this.props.isCorrect ? "✔" : "✘"
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
          onClick={
            () => this.props.parent.deleteAnswer(this.props.index)
          }
        />
      </div>
    )
  }
}