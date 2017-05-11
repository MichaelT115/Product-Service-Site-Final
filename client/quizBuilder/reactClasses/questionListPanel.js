// Handles the list of questions. Loads an array of question ids
class QuestionListPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadQuestions = this.loadQuestions.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
  }

  componentWillMount() {
    this.loadQuestions();
  }

  // Loads the questions.
  loadQuestions() {
    sendAjax('GET', '/getQuestions', { _csrf: this.props.csrf, })
      .then((data) => {
        this.setState({
          data: {
            questions: data.questions,
          },
        });
      }).then(setMessageSaved);
  }

  // Add question to quiz
  addQuestion() {
    sendAjax('POST', '/buildQuestion', { _csrf: this.props.csrf, })
      .then(this.loadQuestions);
  }

  // Delete question from quiz
  deleteQuestion(questionIndex) {
    const self = this;
    sendAjax('DELETE', '/deleteQuestion', { _csrf: this.props.csrf, index: questionIndex })
      .then(this.loadQuestions);
  }

  // Render the questions
  render() {
    const self = this;
    const questions = this.state.data.questions || [];

    // Check if question ids are loaded
    if (questions.length === 0) {
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
        < QuestionPanel key={question.id} index={index} question={question} parent={self} csrf={self.props.csrf} />
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