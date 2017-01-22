const Datastore = require('nedb');
db = {};

//Database for storing player throws
db.players = new Datastore({ filename: './databases/players.db', autoload: true } );

//Expose database
module.exports =  db;
