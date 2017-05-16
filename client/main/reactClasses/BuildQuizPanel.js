// The panel that holds Build Quiz form.
class BuildQuizPanel extends React.Component {
  // Handles when the submit quiz button is used.
  submitQuiz(e) {
    e.preventDefault();

    // Check if the name is given
    if ($('#buildQuizName').val() === '') {
      handleError('Title required.');
      return false;
    }

    // Send build quiz request
    sendAjax('POST', $('#quizForm').attr('action'), $('#quizForm').serialize(), redirect);

    return false;
  }

  // Render the panel
  render() {
    return (
      <div id="buildQuizFormPanel" className="panel">
        <h1>Build Your Own</h1>
        <form
          id="quizForm"
          name="quizForm"
          onSubmit={this.submitQuiz}
          action="/buildQuiz"
          method="POST"
        >
          <label htmlFor="name"> Title: </label>
          <input id="buildQuizName" type="text" name="title" placeholder="Quiz Title" />
          <input type="hidden" name="_csrf" value={this.props.csrf} />
          <input type="submit" value="Create Quiz" />
        </form>
        <div id="errorMessage"></div>
      </div>
    );
  }
}