var express = require('express');
var router = express.Router();
const { Sequelize, Model, DataTypes } = require('sequelize');
const passport = require('passport');

function functionOauth(req,res,next){
  if(req.isAuthentificated()){
    return next();
  }
  res.redirect('/auth/github')
}

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
},{
  timestamps: false,
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
},{
  timestamps: false,
})

const Joue = sequelize.define('Joue', {
  idConcert: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  idStyle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
},{
  timestamps: false,
})

const Participe = sequelize.define('Participe', {
  idConcert: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  idVisiteur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
},{
  timestamps: false,
})

const Realise = sequelize.define('Realise', {
  idArtiste: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  idConcert: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
},{
  timestamps: false,
})

const Style = sequelize.define('Style', {
  idStyle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  libelle: {
    type: DataTypes.CHAR,
  },
  description: {
    type: DataTypes.CHAR,
  }
},{
  timestamps: false,
})

const Ville = sequelize.define('Ville', {
  idVille: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.CHAR,
  },
  coordonnees: {
    type: DataTypes.TEXT,
  }
},{
  timestamps: false,
})

const Visiteur = sequelize.define('Visiteur', {
  idVisiteur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.CHAR,
  },
  prenom: {
    type: DataTypes.CHAR,
  },
  email: {
    type: DataTypes.CHAR,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  adresse: {
    type: DataTypes.CHAR,
  },
  idParrain: {
    type: DataTypes.INTEGER,
  },
  idVille: {
    type: DataTypes.INTEGER,
  }
},{
  timestamps: false,
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

router.get('/liveaddict/:param/:param2?/:param3?/:aggregat?', functionOauth, async function(req, res, next) {
  let { param, param2, param3, aggregat } = req.params;

  if(param){
    param = param.charAt(0).toUpperCase() + param.slice(1);
  }
  if(param2){
    param2 = param2.charAt(0).toUpperCase() + param2.slice(1);
  }

  const models = {
    Artistes: Artiste,
    Styles: Style,
    Concerts: Concert,
    Visiteurs: Visiteur
  };

  const villes = await Ville.findAll();
  const artistes = await Artiste.findAll();

  const isVille = villes.some(ville => ville.nom === param2);
  const isArtiste = artistes.some(artiste => artiste.pseudo === param2);

  try {
    if (param in models) {
      const Model = models[param];
      let results;

      if (!param2) {
        results = await Model.findAll(); //L'ensemble des artistes/styles/concerts/visiteurs
      } 
      else if(isVille) {
        const ville = await Ville.findOne({
          attributes: ['idVille'],
          where: { nom: param2 }
        });

        if (param === "Concerts" || param === "Visiteurs") { //L'ensemble des visiteurs/concerts d'une ville
          
          if(param === "Concerts" && param3){ //L'ensemble des concerts d'un style d'une ville
            
            if(aggregat){//La proportion des styles écoutés par ville
              if(aggregat == "proportion"){
                const style = await Style.findOne({
                  attributes: ['idStyle'],
                  where: { libelle: param3 }
                });
    
                const concerts = await Joue.count({
                  attributes: ['idConcert'],
                  where: { idStyle: style.idStyle }
                });
                
                const concerts_count = await Joue.findAll({
                  attributes: ['idConcert'],
                  where: { idStyle: style.idStyle }
                });
    
                const concertIds = concerts_count.map(concert => concert.idConcert);
    
                const total = await Model.count({
                  where: { idConcert: concertIds, idVille: ville.idVille }
                });
    
                results = total +"/"+ concerts+" des concerts de "+param2+" sont des concerts de "+param3;
              }
              else{
                results = "Incorrect parameters";
              }
            }
            else{
              const style = await Style.findOne({
                attributes: ['idStyle'],
                where: { libelle: param3 }
              });
  
              const concerts = await Joue.findAll({
                attributes: ['idConcert'],
                where: { idStyle: style.idStyle }
              });
  
              const concertIds = concerts.map(concert => concert.idConcert);
  
              results = await Model.findAll({
                where: { idConcert: concertIds, idVille: ville.idVille }
              });
            }

          }
          else{
            results = await Model.findAll({
              where: { idVille: ville.idVille }
            });
          }
        }
      }
      else if(isArtiste){ // l'ensemble des concerts d'un artiste
        const artiste = await Artiste.findOne({
          attributes: ['idArtiste'],
          where: { pseudo: param2 }
        });
        
        const concerts = await Realise.findAll({
          attributes: ['idConcert'],
          where: { idArtiste: artiste.idArtiste }
        });
        
        const concertIds = concerts.map(concert => concert.idConcert);
        
        results = await Model.findAll({
          where: { idConcert: concertIds }
        });

      }
      res.send(results);
    }
    else {
      res.send("Invalid parameters");
    }
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

router.get('/connected'), functionOauth, function(req,res,next){
  res.send("Connected successfully");
}

module.exports = router;