// Setup the quiz player page
const setup = function (csrf) {
  ReactDOM.render(
    <GamePanel csrf={csrf} />, document.querySelector('#quizPlayer')
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
