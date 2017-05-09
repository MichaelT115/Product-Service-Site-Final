const models = require('../models');

const Account = models.Account;

// Get login page
const loginPage = (req, res) => res.render('login', { csrfToken: req.csrfToken() });

// Get main page of app
const appPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

// Get user settings page
const userSettingsPage = (req, res) => res.render('userSettings', { csrfToken: req.csrfToken() });

// Logout of app
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Login to app
const login = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // Check for both fields
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Authenticate username and password then direct to app
  return Account.AccountModel.authenticate(username, password)
    .then(
    (account) => {
      req.session.account = Account.AccountModel.toAPI(account);
      console.dir(req.session.account);
      return res.json({ redirect: '/app' });
    },
    () => res.status(401).json({ error: 'Wrong username or password.' })
    );
};

// Signup to app
const signup = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Check all fields
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Compares password fields
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  // Create account
  return Account.AccountModel.generateHash(req.body.pass)
    .then(
    (passwordSaltHash) => {
      // Create new account
      const accountData = {
        username: req.body.username,
        salt: passwordSaltHash.salt,
        password: passwordSaltHash.hash,
      };
      const newAccount = new Account.AccountModel(accountData);

      // Start saving promise
      const savePromise = newAccount.save();

      // Redirect to app page when saved
      savePromise.then(() => {
        req.session.account = Account.AccountModel.toAPI(newAccount);
        return res.json({ redirect: '/app' });
      });

      // Catch error
      savePromise.catch((err) => {
        console.log(err);

        if (err.code === 11000) {
          return res.status(400).json({ error: 'Username already in use.' });
        }

        return res.status(400).json({ error: 'An error occurred' });
      });
    }
    );
};

// Get the current user account object in session
const getCurrentUser = (request, response) => {
  const req = request;
  const res = response;

  return res.json({
    account: {
      _id: req.session.account._id,
      username: req.session.account.username,
    },
  });
};

// Update username
const updateUsername = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  req.body.user = `${req.body.user}`;

  // Check username field.
  if (!req.body.user) {
    return res.status(400).json({ error: 'You need to enter a username.' });
  }

  // Update Username
  return Account.AccountModel.updateUsername(req.session.account._id, req.body.user)
    .then((account) => {
      req.session.account = Account.AccountModel.toAPI(account);
      return res.json({ redirect: '/app' });
    })
    .catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
};

// Reset password
const updatePassword = (request, response) => {
  const req = request;
  const res = response;

  // Cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Check for both password fields
  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All password fields are required.' });
  }

  // Check if both password fields are not equal.
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  // Generate hash
  return Account.AccountModel.generateHash(req.body.pass)
    .then(
    // Update password
    (passwordSaltHash) =>
      Account.AccountModel
        .updatePassword(req.session.account._id, passwordSaltHash.hash, passwordSaltHash.salt)
        .then((account) => {
          req.session.account = Account.AccountModel.toAPI(account);
          return res.json({ redirect: '/app' });
        })
        .catch((err) => {
          console.log(err);

          return res.status(400).json({ error: 'An error occurred' });
        })
    );
};

// Get csrfToken
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.mainPage = appPage;
module.exports.userSettingsPage = userSettingsPage;
module.exports.getCurrentUser = getCurrentUser;
module.exports.updateUsername = updateUsername;
module.exports.updatePassword = updatePassword;
