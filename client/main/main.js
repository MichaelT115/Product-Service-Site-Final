// Setup the main app page/user-related pages
const setup = function (csrf) {
  // Check if the user settings div exists
  const userSettingsDiv = document.querySelector('#userSettings');
  if (userSettingsDiv) {
    ReactDOM.render(<UserSettingPanel csrf={csrf} />, userSettingsDiv);
  }

  // Check if the history div exists
  const historyDiv = document.querySelector('#history');
  if (historyDiv) {
    ReactDOM.render(<HistoryPanel csrf={csrf} />, historyDiv);
  }

  // Check if the build quiz form div  exists
  const buildQuizDiv = document.querySelector('#buildQuiz');
  if (buildQuizDiv) {
    ReactDOM.render(<BuildQuizPanel csrf={csrf} />, buildQuizDiv);
  }

  // Check if the quiz list div exists
  const quizListDiv = document.querySelector('#quizList');
  if (quizListDiv) {
    ReactDOM.render(<QuizListPanel csrf={csrf} />, quizListDiv);
  }
};

// Get csrf and begin setup
const getToken = () => {
  sendAjax('GET', '/getToken')
    .then((result) => {
      setup(result.csrfToken);
    });
};

$(document).ready(getToken);
