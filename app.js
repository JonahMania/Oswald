var token = require("./token");
var Oswald = require("./src/oswald");

var settings = {
    "token":token,
    "name":"oswald"
}

//Run the bot
var oswald = new Oswald( settings );

oswald.run();