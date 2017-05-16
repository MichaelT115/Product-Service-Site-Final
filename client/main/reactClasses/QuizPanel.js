// Panel that holds information and options for a quiz
class QuizPanel extends React.Component {
  constructor() {
    super();

    this.playQuiz = this.playQuiz.bind(this);
    this.viewQuizLeaderboard = this.viewQuizLeaderboard.bind(this);
    this.editQuiz = this.editQuiz.bind(this);
    this.deleteQuiz = this.deleteQuiz.bind(this);
  }

  // Request to select and play this panel's quiz
  playQuiz() {
    sendAjax('GET', `/playQuiz?quiz=${this.props.quiz.publicId}`, {
      _csrf: this.props.csrf,
    }).then(redirect);
  };

  // Request to select and view the quizzes leaderboard
  viewQuizLeaderboard() {
    sendAjax('GET', `/getLeaderboardPage?quiz=${this.props.quiz.publicId}`, {
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

  // Render quiz panel
  render() {
    const quiz = this.props.quiz;
    // Print description of quiz.
    const printDescription = () => {
      if (quiz.description) {
        // Handle line breaks
        const lines = quiz.description.split("\n").map((line, index) => {
          return <p key={index}>{line}</p>;
        })
        return lines;
      }
      return (
        <div>No Description</div>
      )
    };

    // Each quiz has different options depend on if it is the creation of the current account
    const quizOptions = quiz.isCreation ?
      (
        <div className="quizOptions">
          <button className="button" onClick={this.playQuiz}> Play Quiz </button>
          <button className="button" onClick={this.viewQuizLeaderboard}> Leaderboard </button>
          <button className="button" onClick={this.editQuiz}> Edit Quiz </button>
          <button className="button" onClick={this.deleteQuiz}> Delete Quiz </button>
        </div>
      ) :
      (
        <div className="quizOptions">
          <button className="button" onClick={this.playQuiz}> Play Quiz </button>
          <button className="button" onClick={this.viewQuizLeaderboard}> Leaderboard </button>
        </div>
      );


    // Render quiz panel
    return (
      <div className="panel quizPanel">
        <header>
          <h2> {quiz.title} </h2>
          <h3> created by {quiz.creator} </h3>
        </header>
        <div className="quizDescription">
          {printDescription()}
        </div>
        {quizOptions}
      </div>
    );
  }
}