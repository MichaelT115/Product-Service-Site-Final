// Various tests to run before requests go through //


// Checks for an account in the session
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// Checks to see if there is not an account in session
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/app');
  }

  return next();
};

// Checks for HTTPs requests
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

// Bypass wether its and HTTPs or not
const bypassSecure = (req, res, next) => {
  next();
};

// Checks to see if there a quiz selected in the session
const requiresQuizSelected = (req, res, next) => {
  if (!req.session.quiz) {
    return res.redirect('/');
  }
  return next();
};

// Checks to see if there is no quiz selected
const requiresNoQuizSelected = (req, res, next) => {
  if (!req.session.quiz) {
    return res.redirect('/');
  }
  return next();
};

module.exports = {
  requiresLogin,
  requiresLogout,
  requiresSecure: process.env.NODE_ENV === 'production' ?
    requiresSecure : bypassSecure,

  requiresQuizSelected,
  requiresNoQuizSelected,
};
