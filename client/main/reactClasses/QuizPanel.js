// Panel that holds information and options for a quiz
class QuizPanel extends React.Component {
  constructor() {
    super();

    this.playQuiz = this.playQuiz.bind(this);
    this.editQuiz = this.editQuiz.bind(this);
    this.deleteQuiz = this.deleteQuiz.bind(this);
  }

  // Request to select and play this panel's quiz
  playQuiz() {
    sendAjax('GET', `/playQuiz?quiz=${this.props.quiz.publicId}`, {
      _csrf: this.props.csrf,
    }).then(redirect);
  };

  // Request to select and edit this panel's quiz
  editQuiz() {
    sendAjax('GET', `/editQuiz?quiz=${this.props.quiz.publicId}`, {
      _csrf: this.props.csrf,
    }).then(redirect);
  };

  // Request to delete and edit this panel's quiz
  deleteQuiz() {
    sendAjax('DELETE', '/deleteQuiz', {
      _csrf: this.props.csrf,
      publicId: this.props.quiz.publicId,
    }).then(this.props.onChange);
  }

  render() {
    const quiz = this.props.quiz;
    // Print description of quiz.
    const printDescription = () => {
      if (quiz.description) {
        const lines = quiz.description.split("\n").map((line, index) => {
          return <p key={index}>{line}</p>;
        })
        return lines;
      }
      return (
        <div>No Description</div>
      )
    };

    const quizOptions = quiz.isCreation ?
      (
        <div className="quizOptions">
          <button className="makeDomoSubmit" onClick={this.playQuiz}> Play Quiz </button>
          <button className="makeDomoSubmit" onClick={this.editQuiz}> Edit Quiz </button>
          <button className="makeDomoSubmit" onClick={this.deleteQuiz}> Delete Quiz </button>
        </div>
      ) :
      (
        <div className="quizOptions">
          <button className="makeDomoSubmit" onClick={this.playQuiz}> Play Quiz </button>
        </div>
      );


    // Render quiz panel
    return (
      <div className="panel quizListPanel">
        <h2> {quiz.title} </h2>
        <div>
          {printDescription()}
        </div>
        {quizOptions}
      </div>
    );
  }
}