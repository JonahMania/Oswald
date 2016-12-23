const fs = require('fs');
var Oswald = require("./src/oswald");

//Read slack API token
fs.readFile('credentials/slackToken.json', function processClientSecrets(error, content) {
    if(error){
        console.error(error);
        return;
    }
    var settings = {
        "token":JSON.parse(content).token,
        "name":"oswald"
    }
    //Run the bot
    var oswald = new Oswald( settings );
    oswald.run();
});
