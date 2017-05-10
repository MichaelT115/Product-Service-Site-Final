// Panel that holds question data
class QuestionPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadAnswers = this.loadAnswers.bind(this);
  }

  loadAnswers() {
    this.props.parent.loadQuestions();
  }

  // Update title of question
  updateTitle(title) {
    const self = this;
    sendAjax(
      "PUT",
      '/updateQuestionTitle',
      {
        _csrf: self.props.csrf,
        index: self.props.index,
        title,
      }
    );
  }

  // Update description of question
  updateDescription(content) {
    const self = this;
    sendAjax(
      "PUT",
      '/updateQuestionContent',
      {
        _csrf: self.props.csrf,
        index: self.props.index,
        content,
      }
    );
  }

  // Update the correct answer of the question
  updateCorrectAnswer(answerIndex, isCorrect) {
    const self = this;
    sendAjax(
      "PUT",
      '/updateQuestionCorrectAnswer',
      {
        _csrf: self.props.csrf,
        questionIndex: self.props.index,
        answerIndex: answerIndex,
        isCorrect,
      }
    ).then(self.loadAnswers)
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

    // The resize requires that the DOM element itself is rendered
    // This means that we have to wait for the first frame to be rendered.
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        const questionFields = $(".questionDescription").toArray();
        questionFields.forEach(function (descriptionField) {
          updateTextAreaSize(descriptionField);
        }, this);
      })
    }, 0);

    // Updates the question's title after the user has stopped typing for half a second.
    const titleUpdater =
      new DelayUpdateHandler(
        500,
        () => {
          this.updateTitle($(`#${questionTitleId}`).val())
        }
      );
    // Updates the question's description after the user has stopped typing for half a second.
    const contentUpdater =
      new DelayUpdateHandler(
        500,
        () => {
          this.updateDescription($(`#${questionDescriptionId}`).val())
        }
      );


    const self = this;
    return (
      <div className="questionPanel">
        <span>Question {this.props.index + 1}:</span>
        {/* Delete question when clicked */}
        <input type="button" className="quizBuilderButton deleteQuestion" value="Delete Question"
          onClick={
            () => this.props.parent.deleteQuestion(this.props.index)
          }
        />
        <select defaultValue={question.__t}
          onChange={
            (e) => {
              sendAjax(
                "PUT",
                '/setQuestiontype',
                {
                  _csrf: self.props.csrf,
                  questionIndex: self.props.index,
                  type: e.target.value,
                }
              ).then(self.loadAnswers)
            }
          }
        >
          <option value="MultipleChoice">Multiple Choice</option>
          <option value="TrueFalse">True or False</option>
          <option value="Numeric">Numeric</option>
          <option value="Text">Text Answer</option>
        </select>
        <hr />
        <div>
          <label> Title: </label>
          <input id={questionTitleId} className="questionTitle" type="text" name="name"
            defaultValue={decodeURI(question.title || "")}
            placeholder="Enter Title for Question"
            size={question.title ? question.title.length || 20 : 20}
            onChange={
              (e) => {
                // Update field size
                e.target.size = e.target.value.length || 20;

                // Update title
                titleUpdater.update();
              }
            }
          />
          <br />
        </div>
        <div>
          <label>Question:</label>
          <br />
          <textarea id={questionDescriptionId} className="questionDescription" type="text" name="content"
            placeholder="Enter description"
            defaultValue={question.content}
            onChange={
              (e) => {
                // Update description
                contentUpdater.update();

                // Update text area size
                updateTextAreaSize(e.target);
              }
            } />
          <br />
        </div>
        {/* List the answers to the question */}
        {
          (() => {
            switch (question.type) {
              case "TrueFalse":
                return (
                  <input type="button" className="quizBuilderButton"
                    value={
                      // Set the change correctness button icon
                      question.isTrue ? "✔" : "✘"
                    }
                    onClick={
                      // Change the answer correctness
                      (e) => {
                        sendAjax(
                          "PUT",
                          '/updateAnswerIsTrue',
                          {
                            _csrf: self.props.csrf,
                            questionIndex: self.props.index,
                            isTrue: !question.isTrue,
                          }
                        ).then(self.loadAnswers)
                      }
                    }
                  />
                )
              case "MultipleChoice":
              default:
                return (<AnswerListPanel answers={question.answers} parent={self} correctAnswer={question.correctAnswerIndex} csrf={this.props.csrf} />);
            }
          })()
        }
      </div>
    )
  }
}