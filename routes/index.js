var express = require('express');
var router = express.Router();
const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize('liveAddict', 'root', 'rootpwd', {
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

const Concert = sequelize.define('Concert', {
  idConcert: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  dateConcert: {
    type: DataTypes.DATE,
  },
  nbrPlaceDisponible: {
    type: DataTypes.INTEGER,
  },
  idVille: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chat' });
});

router.all('/rest', function(req, res, next) {
  res.render('numberTranslate', { title: 'Exo Rest' });
});

router.all('/meteo', function(req, res, next) {
  res.render('exoAjax');
});

router.get('/api/:param?/:id?', function(req, res, next) {
  const {param, id} = req.params;
  let data = {
    "authors" : [
      { "id": 1, "firstName": "Tom", "lastName": "Coleman" },
      { "id": 2, "firstName": "Sashko", "lastName": "Stubailo" },
      { "id": 3, "firstName": "Mikhail", "lastName": "Novikov" },
    ]
    ,"posts" : [
      { "id": 1, "authorId": 1, "title": "Introduction to GraphQL", "votes": 2 },
      { "id": 2, "authorId": 2, "title": "Welcome to Meteor", "votes": 3 },
      { "id": 3, "authorId": 2, "title": "Advanced GraphQL", "votes": 1 },
      { "id": 4, "authorId": 3, "title": "Launchpad is Cool", "votes": 7 },
    ]
  };
  if(!param){
    res.status(200).send(
      data
    );
  }
  else if (!Object.keys(data).includes(param)) {
    res.status(400).send("Invalid parameter : "+ param);
  }
  else{
    let results = data[param];
    let max_id = results.length;
    if(id){
      results = results.filter(result => result.id == id);
    }
    if(results.length){
      res.status(200).send(results);
    }
    else{
      res.status(400).send("Unassigned Id : " + id + ". Currently, Ids are comprised between 1 and " + max_id);
    }
  }
});

router.get('/liveaddict/:param?', function(req, res, next) {
  const {param} = req.params;

  if(!param){
    res.send("Hello")
  }
  else{
    const datas = sequelize.query("SELECT * FROM `"+param+"`").then((datas) => {
      res.send(datas);
    });
  }
});

module.exports = router;
