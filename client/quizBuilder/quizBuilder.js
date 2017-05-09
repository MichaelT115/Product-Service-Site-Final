// Setup the quiz builder page
const setup = function (csrf) {
  ReactDOM.render(
    <QuizInfoPanel csrf={csrf} />, document.querySelector('#quizBuilder')
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
