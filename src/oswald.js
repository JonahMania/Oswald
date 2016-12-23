const Bot = require("slackbots");
const util = require('util');
const dictionaryParser = require("./dictionary/dictionaryParser");
const events = require("./events");

const helpMessage = "commands\n\
!nextTournament \n\
displays the next tournament \n\
!nextTournaments \n\
displays the next three tournaments \n\
!nextPractice \n\
displays the next practice \n\
!nextPractices \n\
displays the next three practices \n\
@oswald define [keyword]\n\
displays the definition of the requested word \n\
@oswald help \n\
displays this message \n\
@oswald source \n\
displays a link to my source code \n\
\n\
If you find any bugs or wish to improve the bot please contact Jonah Mania or Keyur Ved\n\
";

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
        if( message.type === 'message' && Boolean(message.text) && typeof message.channel === 'string' && message.user !== this.self.id ){
            //Handle !nextPractices
            if( message.text.toLowerCase().indexOf("!nextpractices") !== -1 ){
                events.getNextPractices(3,function(error,response){
                    if(error){
                        console.error(error);
                    }
                    that.postMessage(message.channel,response,{as_user: true});
                });
            }
            //Handle !nextPractice
            else if( message.text.toLowerCase().indexOf("!nextpractice") !== -1 ){
                events.getNextPractices(1,function(error,response){
                    if(error){
                        console.error(error);
                    }
                    that.postMessage(message.channel,response,{as_user: true});
                });
            }
            //Handle !nextTournaments
            if( message.text.toLowerCase().indexOf("!nexttournaments") !== -1 ){
                events.getNextTournaments(3,function(error,response){
                    if(error){
                        console.error(error);
                    }
                    that.postMessage(message.channel,response,{as_user: true});
                });
            }
            //Handle !nextTournament
            else if( message.text.toLowerCase().indexOf("!nexttournament") !== -1 ){
                events.getNextTournaments(1,function(error,response){
                    if(error){
                        console.error(error);
                    }
                    that.postMessage(message.channel,response,{as_user: true});
                });
            }
            //Check if the message was directed at the bot
            if( message.text.indexOf("<@"+this.self.id+">") !== -1 ){
                //Message without @username
                var messageText = message.text.split( "<@"+this.self.id+">" )[1].toLowerCase();
                //messageText without spaces
                var messageTextNoSpaces = messageText.replace(/ /g,'');
                //If the user asks for a definition
                if( new RegExp("/|define |def |dict |dictionary |what is |who is |what are |whats a |/").test(messageText) ){
                    this.postMessage(message.channel,dictionaryParser.parseString(message.text),{as_user: true});
                }
                //If the user has asked for a help menu
                if( messageTextNoSpaces == "help" ){
                    this.postMessage(message.channel,helpMessage,{as_user: true});
                }
                //If the user has asked for the source code
                if( messageTextNoSpaces == "source" ||  messageTextNoSpaces == "sourcecode" || messageTextNoSpaces == "code" ){
                    this.postMessage(message.channel,"https://github.com/JonahMania/Oswald",{as_user: true});
                }
            }
        }
    }
}

module.exports = Oswald;
