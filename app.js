const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const oauth2 = require('oauth2');

const app = express();

const oauth2Client = oauth2.createClient({
  clientId: 'VOTRE_CLIENT_ID',
  clientSecret: 'VOTRE_CLIENT_SECRET',
  authorizationUri: 'URI_DE_L_AUTHORIZATION',
  tokenUri: 'URI_DU_TOKEN',
  redirectUri: 'URI_DE_RETOUR_APRES_AUTHENTIFICATION',
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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