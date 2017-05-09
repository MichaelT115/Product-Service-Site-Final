// Render log in window
const createLoginWindow = function (csrf) {
  ReactDOM.render(
    <LoginFromPanelClass csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Render sign up window
const createSignupWindow = function (csrf) {
  ReactDOM.render(
    <SignUpFromPanelClass csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Set up login and sing up buttons to create related windows
const setup = function (csrf) {
  const loginButton = document.querySelector('#loginButton');
  const signupButton = document.querySelector('#signupButton');

  // Signup button renders sign up window
  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  // Login button renders login window
  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  createLoginWindow(csrf);  // Default view
};

/// Get csrf and begin setup
const getToken = () => {
  sendAjax('GET', '/getToken')
    .then((result) => {
      setup(result.csrfToken);
    });
};

$(document).ready(getToken);
