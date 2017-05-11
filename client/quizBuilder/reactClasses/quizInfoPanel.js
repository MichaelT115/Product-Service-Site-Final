// Holds the data of the quiz.
// Displays the quiz's title and description.
class QuizInfoPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadQuizInfo = this.loadQuizInfo.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
  }

  // Gets the information about the quiz from the server
  componentWillMount() {
    this.loadQuizInfo();
  }

  loadQuizInfo() {
    sendAjax('GET', '/getQuizInfo')
      .then((quizInfo) => {
        // Set state of quiz
        this.setState({
          data: {
            quizInfo: {
              publicId: quizInfo.publicId,
              title: _.unescape(quizInfo.title || ""), // Handles escape characters
              description: _.unescape(quizInfo.description || ""),
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
    ).then(setMessageSaved);
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
    ).then(setMessageSaved);
  }

  // Render the quiz data
  // Renders the whole quiz
  render() {
    const quizInfo = this.state.data.quizInfo;
    // If the quiz is not ready to show
    if (!quizInfo) {
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
        () => { this.updateTitle($('#quizName').val()) },
        setMessageSaving
      );
    // Updates the description after the user has stopped typing for half a second.
    const descriptionUpdater =
      new DelayUpdateHandler(
        500,
        () => { this.updateDescription($('#quizDescription').val()) },
        setMessageSaving
      );

    return (
      <div id="quizInfoPanel">
        <h1>Quiz Builder</h1>
        <div>Unique URL:  <input type="text" value={createQuizURL(quizInfo.publicId)} readOnly /></div>
        <hr />
        <div>
          <AutoExpandTextField
            id={"quizName"}
            name={"title"}
            placeholder="Type Quiz Title Here"
            defaultValue={quizInfo.title}
            onChange={titleUpdater.update}
          />
        </div>
        <br />
        <div>
          <h2>Description:</h2>
          <AutoExpandTextArea
            id="quizDescription"
            name="name"
            defaultValue={quizInfo.description}
            onChange={descriptionUpdater.update}
          />
        </div>
        {/* List the questions. */}
        <QuestionListPanel csrf={this.props.csrf} />
      </div >
    );
  }
}