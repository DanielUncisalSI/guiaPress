const Sequelize = require("sequelize");

var database = 'Guiapress';
var user     = 'root';
var password = 'root';
var host     = 'localhost';
var dialect  = 'mysql';
var timezone = '-03:00';


const connection = new Sequelize(database, user, password, {
    host: host,
    dialect: dialect,
    timezone: timezone
}); 


module.exports = connection;