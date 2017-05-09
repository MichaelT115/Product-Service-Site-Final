// Panel that holds information and options for a quiz
class QuizPanel extends React.Component {
  render() {
    const quiz = this.props.quiz; // Quiz is a property used when this react object is created
    const self = this;

    // Request to select and play this panel's quiz
    const playQuiz = () => {
      sendAjax('POST', '/playQuiz', {
        _csrf: self.props.csrf,
        quizId: quiz._id,
      }, redirect);
    };

    // Request to select and edit this panel's quiz
    const editQuiz = () => {
      sendAjax('POST', '/editQuiz', {
        _csrf: self.props.csrf,
        quizId: quiz._id,
      }, redirect);
    };

    // Request to delete and edit this panel's quiz
    const deleteQuiz = () => {
      sendAjax('DELETE', '/deleteQuiz',
        {
          _csrf: self.props.csrf,
          quizId: quiz._id
        },
        () => { self.props.parent.loadQuizzes() }
      );
    }

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

    // Print the options for the quiz
    const printOptions = () => {
      // Returns a different set option depending if the quiz belongs to the user.
      return self.props.isUser ?
        (
          <div className="quizOptions">
            <button className="makeDomoSubmit" onClick={playQuiz}> Play Quiz </button>
            <button className="makeDomoSubmit" onClick={editQuiz}> Edit Quiz </button>
            <button className="makeDomoSubmit" onClick={deleteQuiz}> Delete Quiz </button>
          </div>
        ) :
        (
          <div className="quizOptions">
            <button className="makeDomoSubmit" onClick={playQuiz}> Play Quiz </button>
          </div>
        )
    };

    // Render quiz panel
    return (
      <div className="panel quizListPanel">
        <h2> Name: {quiz.name} </h2>
        <h3> Description: </h3>
        <div>
          {printDescription()}
        </div>
        {printOptions()}
      </div>
    );
  }
}