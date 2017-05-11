// Panel that holds an answer to the question
class AnswerTrueFalsePanel extends React.Component {
  // Create initial data
  constructor() {
    super();

    this.updateAnswerIsTrue = this.updateAnswerIsTrue.bind(this);
  }

  // Update this answer
  updateAnswerIsTrue(isTrue) {
    sendAjax(
      "PUT",
      '/updateAnswerIsTrue',
      {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        isTrue,
      }
    ).then(this.props.onChange)
  }

  // Render answer
  render() {
    const question = this.props.question;
    return (
      <input type="button" className="quizBuilderButton"
        value={
          // Set the change correctness button icon
          question.isTrue ? "✔ TRUE" : "✘ FALSE"
        }
        onClick={
          () => {
            setMessageSaving();
            this.updateAnswerIsTrue(!question.isTrue);
          }
        }
      />
    )
  }
}