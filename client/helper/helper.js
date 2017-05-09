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
    handleError(messageObj.error);
  },
});

// Update the size of a text area
const updateTextAreaSize = (_textArea) => {
  const textArea = _textArea;
  textArea.style.height = '0px';
  textArea.style.height = `${textArea.scrollHeight + 5}px`;
};
