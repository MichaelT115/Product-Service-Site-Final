
class AnswerTextPanel extends React.Component {
  constructor() {
    super();

    this.updateAnswer = this.updateAnswer.bind(this);
  }

  // Update this answer
  updateAnswer(answer) {
    sendAjax(
      "PUT",
      '/updateAnswerText',
      {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        answer,
      }
    ).then(this.props.onChange)
  }

  // Render answer
  render() {
    const question = this.props.question;
    const answerContentId = `answerContent_text_q${this.props.index}`;

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
        <AutoExpandTextField
          id={answerContentId}
          className="questionTitle"
          placeholder="Type Answer Here"
          defaultValue={question.answer}
          onChange={answerUpdater.update}
        />
      </div>
    )
  }
}