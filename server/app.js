// Import Libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');

// Get port
const port = process.env.PORT || 3000;

// Get mongo database URL
const dbURL = process.env.MONGODB_URI || 'mongodb://heroku_6k9cw3st:v6j11oo4ii06jvsr2qe2cfno87@ds133261.mlab.com:33261/heroku_6k9cw3st';

// Connect to MongoDB database
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
  console.log(`Connected to database at URL: ${dbURL}`);
});

// Connect to redis database
let redisURL = {
  hostname: 'localhost',
  port: 6379,
};
let redisPASS;
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

// Get router
const router = require('./router.js');

// Create express app
const app = express();

// Establish assets folder
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

// Handle favicon
app.use(favicon(path.resolve(`${__dirname}/../hosted/img/favicon.ico`)));

// Set compression
app.use(compression());

app.use(bodyParser.urlencoded({
  extended: true,
}));

// Sessions maps an individual user to a unique key
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

// Set template engine
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

app.disable('x-powered-by');
app.use(cookieParser());

// Use CSRF
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});

// Route paths
router(app);

// State that the server is no listening
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
