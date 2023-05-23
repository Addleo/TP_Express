const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

const app = express();

passport.use(
  'oauth2',
  new OAuth2Strategy(
    {
      authorizationURL: 'https://github.com/login/oauth/authorize',
      tokenURL: 'https://github.com/login/oauth/access_token',
      clientID: 'd396722fd7238a2be057',
      clientSecret: '9f5b7e5a40333b7e5bf938e7ea2001f151bcee7e',
      callbackURL: 'http://localhost:8080/connected',
    },
    (accessToken, refreshToken, profile, done) => {
      // Gérez la réponse du token et les actions suivantes
      return done(null,profile);
    }
  )
);

app.use(session({
  secret: '1a2b3c4d',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github', passport.authenticate('oauth2'));

app.get(
  '/auth/github/callback',
  passport.authenticate('oauth2', { successRedirect: '/', failureRedirect: '/auth/github' })
);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.get('/auth', (req, res) => {
  const authorizationUri = oauth2Client.authorizationUri();
  res.redirect(authorizationUri);
});

// Route pour la redirection après l'authentification
app.get('/callback', (req, res) => {
  const code = req.query.code;
  oauth2Client.getToken(code, (err, tokens) => {
    // Gérez la réponse du token
    console.log(tokens);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(indexRouter);
app.use(usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;