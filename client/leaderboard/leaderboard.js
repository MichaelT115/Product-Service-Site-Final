// Setup the quiz player page
const setup = function (csrf) {
  ReactDOM.render(
    <LeaderboardPanel csrf={csrf} />, document.querySelector('#leaderboard')
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken')
    .then((result) => {
      setup(result.csrfToken);
    });
};

// Get csrf and begin setup
$(document).ready(getToken);
