const createError = require('http-errors');
const express = require('express');
//const { Sequelize, Model, DataTypes } = require('sequelize');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//const mysql = require('mysql');

const app = express();

/*const sequelize = new Sequelize('liveAddict', 'root', 'rootpwd', {
  host: 'localhost',
  port: 4000,
  dialect: 'mariadb',
  define: {
    //prevent sequelize from pluralizing table names
    freezeTableName: true
  }
});

sequelize.authenticate().then(() =>{
    console.log("Connected!")
  }
).catch((err) => {
    console.log("error connecting =(", err)
  }
)

const Artiste = sequelize.define('Artiste', {
  idArtiste: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  pseudo: {
    type: DataTypes.STRING,
  },
  idStyle: {
    type: DataTypes.INTEGER,
  }
})

async function get_artiste() {
  const artistes = await sequelize.query("SELECT * FROM `Artiste`", {
    model: Artiste,
  });
  console.log("List of artists :");
  for(param of artistes) {
    console.log(param.pseudo);
  }
}
get_artiste();*/


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