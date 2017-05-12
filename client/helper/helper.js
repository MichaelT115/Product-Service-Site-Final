// Handle error by updating text of error div
const handleError = (message) => {
  $('#errorMessage').text(message);
};

// Redirect webpage
const redirect = (response) => {
  window.location = response.redirect;
};

// Send ajax request. Returns a JQuery differed object that can be treated like a promise.
const sendAjax = (type, action, data, success) => $.ajax({
  cache: false,
  type,
  url: action,
  data,
  dataType: 'json',
  success,
  error(xhr, status, error) {
    const messageObj = JSON.parse(xhr.responseText);
    console.dir(action);
    handleError(messageObj.error);
  },
});

const createQuizURL = (publicId) =>
  `${window.location.host}/quizPlayer?quiz=${publicId}`;

const setMessageSaving = () => {
  $('#quizSaveMessage').text('Saving...');
};

const setMessageSaved = () => {
  $('#quizSaveMessage').text('Database Up-To-Date');
};
