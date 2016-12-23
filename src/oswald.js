const Bot = require("slackbots");
const util = require('util');
const dictionaryParser = require("./dictionary/dictionaryParser");
const events = require("./events");

class Oswald extends Bot {
    /**
    * Constructor
    * @param {string} token The API token for the bot
    */
    constructor(settings){
        //Inherit from Bot class
        super(settings);
    }
    /**
    * Function to start the bot
    */
    run(){
        console.log("Starting oswald");
        //Set function to run when a message is read
        this.on('message', this.onMessage);
        this.startupMessage();
    }
    startupMessage(){
        this.postMessageToGroup("development","Starting Bot",{as_user: true});
    };
    /**
    * Function to run when a message is recieved
    * @param {object} message Object with message from a user
    */
    onMessage( message ){
        var that = this;
        //Check that we are getting a chat message
        if( message.type === 'message' && Boolean(message.text) && typeof message.channel === 'string'){
            //Handle !nextPractices
            if( message.text.indexOf("!nextPractices") !== -1 ){
                // var channel = that.getNameById(message.channel);

                events.getNextPractices(3,function(error,response){
                    if(error){
                        console.error(error);
                    }
                    that.postMessage(message.channel,response,{as_user: true});
                });
            }
            //Handle !nextPractice
            else if( message.text.indexOf("!nextPractice") !== -1 ){
                // var channel = that.getNameById(message.channel);

                events.getNextPractices(1,function(error,response){
                    if(error){
                        console.error(error);
                    }
                    that.postMessage(message.channel,response,{as_user: true});
                });
            }
            //Check if the message was directed at the bot
            if( message.text.indexOf("<@"+this.self.id+">") !== -1 ){
                //If the user asks for a definition
                if( new RegExp("/|define |def |dict |dictionary |what is |who is |what are |whats a |/").test(message.text) ){
                    this.postMessage(message.channel,dictionaryParser.parseString(message.text),{as_user: true});
                }

            }
        }
    }
}

module.exports = Oswald;
