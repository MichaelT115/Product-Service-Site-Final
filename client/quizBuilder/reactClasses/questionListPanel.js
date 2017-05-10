// Handles the list of questions. Loads an array of question ids
class QuestionListPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadQuestions = this.loadQuestions.bind(this);
  }

  // Loads the questions.
  loadQuestions() {
    this.props.loadQuestions();
  }

  // Add question to quiz
  addQuestion() {
    const self = this;
    sendAjax('POST', '/buildQuestion', { _csrf: this.props.csrf, })
      .then((data) => {
        self.loadQuestions();
      });
  }

  // Delete question from quiz
  deleteQuestion(questionIndex) {
    const self = this;
    sendAjax('DELETE', '/deleteQuestion', { _csrf: this.props.csrf, index: questionIndex })
      .then((data) => {
        self.loadQuestions();
      });
  }

  // Render the questions
  render() {
    const self = this;
    const questions = this.props.questions;

    // Check if question ids are loaded
    if (!questions) {
      return (
        <div>
          <h3>No Questions Yet</h3>
          < input type="button" onClick={self.addQuestion.bind(self)} value="Add Question" />
        </div>
      )
    };

    // Create question nodes
    const questionNodes = questions.map((question, index) => {
      // Render the question itself
      return (
        < QuestionPanel key={question + index} index={index} question={question} parent={self} csrf={self.props.csrf} />
      )
    });

    // Render questions
    return (
      <div>
        {questionNodes}
        {/* Add question when clicked */}
        <input className="quizBuilderButton" type="button" onClick={self.addQuestion.bind(self)} value="Add Question" />
      </div>
    )
  }
}