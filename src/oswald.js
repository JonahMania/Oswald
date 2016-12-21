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
        //Check that we are getting a chat message
        if( message.type === 'message' && Boolean(message.text) && typeof message.channel === 'string'){
            //Check if the message was directed at the bot
            if( message.text.indexOf("<@"+this.self.id+">") !== -1 ){
                console.log("recieved a message from user " + message.user);
                var that = this;
                //If the user wants to know when the next practice is
                if( new RegExp("practice").test(message.text)){
                    events.getNextPractices(1,function(error,response){
                        if(error){
                            console.error(error);
                        }
                        that.postMessageToGroup("development",response,{as_user: true});
                    });
                }
                //If the user asks for a definition
                if( new RegExp("/|define |def |dict |dictionary |what is |who is |what are |whats a |/").test(message.text) ){
                    this.postMessageToGroup("development",dictionaryParser.parseString(message.text),{as_user: true});
                }

            }
        }
    }
}

module.exports = Oswald;
