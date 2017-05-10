// Holds the data of the quiz.
// Displays the quiz's title and description.
class QuizInfoPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadQuestions = this.loadQuestions.bind(this);
  }

  // Gets the information about the quiz from the server
  componentWillMount() {
    const self = this;
    sendAjax('GET', '/getQuiz')
      .then((data) => {
        // Set state of quiz
        self.setState({
          data: {
            quiz: {
              publicId: data.quiz.publicId,
              title: _.unescape(data.quiz.title || ""), // Handles escape characters
              description: _.unescape(data.quiz.description || ""),
              questions: data.quiz.questions,
            },
          },
        });
      });
  }

  // Update the title of the quiz in the database
  updateTitle(title) {
    sendAjax(
      'PUT',
      '/updateQuizTitle',
      {
        _csrf: this.props.csrf,
        title: title || "Untitled Quiz",
      }
    );
  }

  // Update the description of the quiz in the database  
  updateDescription(description) {
    sendAjax(
      'PUT',
      '/updateQuizDescription',
      {
        _csrf: this.props.csrf,
        description: description, // Okay if empty
      }
    );
  }

  loadQuestions() {
    const self = this;
    sendAjax('GET', '/getQuiz')
      .then((data) => {
        // Set state of quiz
        self.setState({
          data: {
            quiz: {
              publicId: data.quiz.publicId,
              title: _.unescape(data.quiz.title || ""), // Handles escape characters
              description: _.unescape(data.quiz.description || ""),
              questions: data.quiz.questions,
            },
          },
        });
      });
  }

  // Render the quiz data
  // Renders the whole quiz
  render() {
    const quiz = this.state.data.quiz;
    // If the quiz is not ready to show
    if (!quiz) {
      return (
        <div id="quizInfoPanel">
          <h3>Quiz Not Loaded</h3>
        </div>
      )
    };

    // Updates the quiz after the user has stopped typing for half a second.
    const titleUpdater =
      new DelayUpdateHandler(
        500,
        () => {
          this.updateTitle($('#quizName').val())
        }
      );
    // Updates the description after the user has stopped typing for half a second.
    const descriptionUpdater =
      new DelayUpdateHandler(
        500,
        () => {
          this.updateDescription($('#quizDescription').val())
        }
      );

    // The resize requires that the DOM element itself is rendered
    // This means that we have to wait for the first frame to be rendered.
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        updateTextAreaSize($("#quizDescription")[0]);
      })
    }, 0);

    return (
      <div id="quizInfoPanel">
        <h1>Quiz Builder</h1>
        <hr />
        {/* Instructions */}
        Fields are saved automatically. Just type.<br />
        Click on the '✘' next to answer to mark it true.<br />
        Click on the '✔' next to answer to mark it false.<br />
        Only one answer can be true at a time.
        <hr />
        Unique URL:  <input id="quizName" type="text" value={"https://mtc-product-service-final.herokuapp.com/quizPlayer?quiz=" + quiz.publicId} />
        <div>
          <input id="quizName" type="text" name="title"
            size={quiz.title.length || 25}
            placeholder="Type Quiz Title Here"
            defaultValue={quiz.title}
            onChange={(e) => {
              // Update length of field
              e.target.size = e.target.value.length || 25;
              // Update the name of the quiz
              titleUpdater.update();
            }}
          />
        </div>
        <br />
        <div>
          <h2>Description:</h2>
          <textarea id="quizDescription" type="text" name="name"
            defaultValue={quiz.description}
            onChange={(e) => {
              // Update the quiz description
              descriptionUpdater.update();
              // Update the size of the text area
              updateTextAreaSize(e.target);
            }}
          />
        </div>
        {/* List the questions. */}
        <QuestionListPanel questions={quiz.questions} loadQuestions={this.loadQuestions} csrf={this.props.csrf} />
      </div >
    );
  }
}