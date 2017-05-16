// Panel that holds the user's quiz history
class LeaderboardPanel extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadLeaderboard = this.loadLeaderboard.bind(this);
  }

  // When this is rendered, load the account
  componentDidMount() {
    this.loadLeaderboard();
  }

  // Load account data  
  loadLeaderboard() {
    const self = this;
    sendAjax('GET', '/getLeaderboard', { _csrf: this.props.csrf })
      .then((data) => {
        self.setState({
          data: {
            quiz: data.quiz,
            entries: data.entries,
          },
        });
      });
  }


  render() {
    const entries = this.state.data.entries;
    const quiz = this.state.data.quiz;

    // Check if the account data is loaded
    if (!entries || !quiz) {
      return (
        <div className="panel">No Attempts Found.</div>
      )
    }

    const entryNodes = entries
      .sort((a, b) => a.score < b.score)
      .map((entry, index) => {
        return (
          <div key={index} className="panel" >
            <b>{index + 1}.</b> {entry.account} - {entry.score} points
        </div >
        );
      });

    /// Render account options 
    return (
      <div className="panel">
        <h2>{quiz.title}</h2>
        <hr />
        {entryNodes}
      </div>
    );
  }
}