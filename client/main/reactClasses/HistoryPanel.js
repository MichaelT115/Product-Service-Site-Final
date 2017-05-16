// Panel that holds the user's quiz history
class HistoryPanel extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.state.data = {};

    this.loadHistory = this.loadHistory.bind(this);
  }

  // When this is rendered, load the history
  componentDidMount() {
    this.loadHistory();
  }

  // Load history
  loadHistory() {
    sendAjax('GET', '/getHistory', { _csrf: this.props.csrf })
      .then((data) => {
        this.setState({
          data: {
            owner: data.owner,
            history: data.entries,
          },
        });
      });
  }

  // Render history
  render() {
    const history = this.state.data.history;
    const owner = this.state.data.owner;

    // Check if the account data is loaded
    if (!history || !owner) {
      return (
        <div className="panel">History Not Found</div>
      )
    }

    const historyNodes = history.map((entry, index) => {
      const date = new Date(entry.date);
      return (
        <div key={index} className="panel" >
          <b>{date.toLocaleString()}:</b> {entry.quiz} - {entry.score} points.
        </div >
      );
    });

    /// Render account options 
    return (
      <div className="panel">
        <h2>{owner}'s History</h2>
        <hr />
        {historyNodes}
      </div>
    );
  }
}