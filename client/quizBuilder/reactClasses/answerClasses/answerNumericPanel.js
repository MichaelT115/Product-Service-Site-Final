
class AnswerNumericPanel extends React.Component {
  constructor() {
    super();

    this.updateAnswerNumeric = this.updateAnswerNumeric.bind(this);
    this.updateAnswerError = this.updateAnswerError.bind(this);
  }

  // Update this answer
  updateAnswerNumeric(answer) {
    sendAjax(
      "PUT",
      '/updateAnswerNumeric',
      {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        answer,
      }
    ).then(this.props.onChange)
  }

  // Update this answer
  updateAnswerError(error) {
    sendAjax(
      "PUT",
      '/updateAnswerError',
      {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        error,
      }
    ).then(this.props.onChange)
  }

  // Render answer
  render() {
    const question = this.props.question;
    return (
      <div>
        Answer: 
        <input 
        type="number"
         step={0.0001} 
         defaultValue={question.answer} 
         name="quantity"
         onChange ={ (e) => {
           setMessageSaving();
            this.updateAnswerNumeric(e.target.value);
             }}
         />
        <br />
        Allowed Error: 
        <input
        type="number"
        min={0}
        step={0.0001}
        defaultValue={question.error}
        name="quantity"
        onChange ={ 
          (e) => {
            setMessageSaving();
            this.updateAnswerError(e.target.value);
          }
         }
         />
      </div>
    )
  }
}