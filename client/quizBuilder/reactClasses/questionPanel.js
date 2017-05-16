// Panel that holds question data
class QuestionPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadQuestions = this.loadQuestions.bind(this);
    this.setQuestionType = this.setQuestionType.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
  }

  // Load questions in question list
  loadQuestions() {
    this.props.parent.loadQuestions();
  }

  // Set the type of the question
  setQuestionType(e) {
    sendAjax(
      "PUT",
      '/setQuestionType',
      {
        _csrf: this.props.csrf,
        questionIndex: this.props.index,
        type: e.target.value,
      }
    ).then(this.loadQuestions)
  }

  // Update title of question
  updateTitle(title) {
    sendAjax(
      "PUT",
      '/updateQuestionTitle',
      {
        _csrf: this.props.csrf,
        index: this.props.index,
        title,
      }
    ).then(setMessageSaved);
  }

  // Update description of question
  updateDescription(content) {
    sendAjax(
      "PUT",
      '/updateQuestionContent',
      {
        _csrf: this.props.csrf,
        index: this.props.index,
        content,
      }
    ).then(setMessageSaved);
  }

  // Render question
  render() {
    const question = this.props.question;
    const questionTitleId = `questionTitle_${this.props.index}`;
    const questionDescriptionId = `questionDescription_${this.props.index}`;

    // Check if the question was loaded
    if (!question) {
      return (
        <div>Question Not Loaded</div>
      )
    }

    // Updates the question's title after the user has stopped typing for half a second.
    const titleUpdater =
      new DelayUpdateHandler(
        500,
        () => {
          this.updateTitle($(`#${questionTitleId}`).val())
        },
        setMessageSaving
      );
    // Updates the question's description after the user has stopped typing for half a second.
    const contentUpdater =
      new DelayUpdateHandler(
        500,
        () => {
          this.updateDescription($(`#${questionDescriptionId}`).val())
        },
        setMessageSaving
      );

    // Pick an answer panel based off the question type
    let answerPanel;
    switch (question.type) {
      // Multiple Choice question
      case "MultipleChoice":
        answerPanel = (<AnswerMultipleChoiceListPanel
          index={this.props.index}
          question={question}
          onChange={this.loadQuestions}
          csrf={this.props.csrf} />);
        break;

      // True/False question
      case "TrueFalse":
        answerPanel = (<AnswerTrueFalsePanel
          index={this.props.index}
          question={question}
          onChange={this.loadQuestions}
          csrf={this.props.csrf}
        />);
        break;

      // Numeric question
      case "Numeric":
        answerPanel = (<AnswerNumericPanel
          index={this.props.index}
          question={question}
          onChange={this.loadQuestions}
          csrf={this.props.csrf}
        />);
        break;

      // Text Question or default case
      default:
      case "Text":
        answerPanel = (<AnswerTextPanel
          index={this.props.index}
          question={question}
          onChange={this.loadQuestions}
          csrf={this.props.csrf}
        />);
        break;
    }

    return (
      <div className="questionPanel">
        <header>
          <span>Question {this.props.index + 1}: </span>
          {/* Lets user change the question type */}
          <select
            className="questionType"
            defaultValue={question.type}
            onChange={this.setQuestionType}
          >
            <option value="MultipleChoice">Multiple Choice</option>
            <option value="TrueFalse">True or False</option>
            <option value="Numeric">Numeric</option>
            <option value="Text">Text Answer</option>
          </select>
          {/* Delete question when clicked */}
          <input type="button" className="quizBuilderButton deleteQuestion" value="Delete Question"
            onClick={
              () => this.props.parent.deleteQuestion(this.props.index)
            }
          />
        </header>
        <hr />
        <div>
          <label> Title: </label>
          {/* Let's the user change the title of the question */}
          <AutoExpandTextField
            id={questionTitleId}
            className="questionTitle"
            name="name"
            placeholder="Enter Title for Question"
            defaultValue={this.props.question.title}
            onChange={titleUpdater.update}
          />
        </div>
        <div>
          <label>Question:</label>
          <br />
          {/* Let's the user change the content of the question */}
          <AutoExpandTextArea
            id={questionDescriptionId}
            className="questionDescription"
            name="content"
            placeholder="Enter description"
            defaultValue={question.content}
            onChange={contentUpdater.update}
          />
          <br />
        </div>
        {/* Show answers */}
        {answerPanel}
      </div>
    )
  }
}