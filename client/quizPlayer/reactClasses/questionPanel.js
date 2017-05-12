// Panel that holds the current question
class QuestionPanel extends React.Component {
  // Create initial data
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.getQuestion = this.getQuestion.bind(this);
    this.pickAnswerPanel = this.pickAnswerPanel.bind(this);
  }

  // When the component is loaded, load the question
  componentDidMount() {
    this.getQuestion();
  }

  getQuestion() {
    sendAjax('GET', `/getQuestion?question=${this.props.game.currentIndex}`, { _csrf: this.props.csrf })
      .then((question) => {
        this.setState({ data: { question } });
      });
  }

  pickAnswerPanel() {
    let answerPanel;
    switch (this.state.data.question.type) {
      case "MultipleChoice":
        answerPanel = (
          <AnswerMultipleChoiceListPanel
            index={this.props.game.currentIndex}
            onCorrectAnswer={
              () => {
                this.props.addScore(25)
                this.props.nextQuestion();
              }
            }
            onWrongAnswer={() => { this.props.addScore(-5) }}
            csrf={this.props.csrf}
          />);
        break;

      case "TrueFalse":
        answerPanel = (<AnswerTrueFalsePanel
          index={this.props.game.currentIndex}
          onCorrectAnswer={
            () => {
              this.props.addScore(25)
              this.props.nextQuestion();
            }
          }
          onWrongAnswer={() => { this.props.addScore(-5) }}
          csrf={this.props.csrf}
        />);
        break;

      case "Numeric":
        answerPanel = (<AnswerNumericPanel
          index={this.props.game.currentIndex}
          onCorrectAnswer={
            () => {
              this.props.addScore(25)
              this.props.nextQuestion();
            }
          }
          onWrongAnswer={() => { this.props.addScore(-5) }}
          csrf={this.props.csrf}
        />);
        break;

      default:
      case "Text":
        answerPanel = (<AnswerTextPanel
          index={this.props.game.currentIndex}
          onCorrectAnswer={
            () => {
              this.props.addScore(25)
              this.props.nextQuestion();
            }
          }
          onWrongAnswer={() => { this.props.addScore(-5) }}
          csrf={this.props.csrf}
        />);
        break;
    }

    return answerPanel;
  }

  // Render question
  render() {
    const question = this.state.data.question;
    const index = this.props.game.currentIndex;

    // Check if the question is loaded
    if (!question) {
      return (<div>Question Not Loaded</div>);
    }

    /// Render question
    return (
      <div className="questionPanel">
        {index + 1}. {question.title}
        {
          // Make sure there are line breaks. Based off: http://stackoverflow.com/questions/35351706/how-to-render-a-multi-line-text-string-in-react
          question.content.split("\n").map((line, index) => {
            return <p key={index}>{line}</p>;
          })
        }
        {/* Render list of answers */}
        {this.pickAnswerPanel()}
      </div>
    )
  }
}