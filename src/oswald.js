const Bot = require("slackbots");
const util = require('util');
const dictionaryParser = require("./dictionary/dictionaryParser");
const events = require("./events");
const throwCounter = require("./throwCounter");
const cronJob = require('cron').CronJob;
const lines = require("./lines");
const weather = require("./weather")

const helpMessage = "commands\n\
@oswald next tournament \n\
displays the next tournament \n\
@oswald next tournaments \n\
displays the next three tournaments \n\
@oswald weather \n\
displays weather for today. Use @oswald weather [today/tomorrow/week] to see future weather forecasts\n\
@oswald next practice \n\
displays the next practice \n\
@oswald next practices \n\
displays the next three practices \n\
@oswald define [keyword] \n\
displays the definition of the requested word \n\
@oswald throws \n\
displays your current throw count. Use @oswald [add/sub] throws [number] to add or remove throws for the weeks\n\
@oswald help \n\
displays this message \n\
@oswald source \n\
displays a link to my source code \n\
\n\
If you find any bugs or wish to improve the bot please contact Joshua Schmidt\n\
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
        var that = this;
        console.log("Starting oswald");
        //Set function to run when a message is read
        this.on('message', this.onMessage);
        this.startupMessage();
        //Job to run every week and notify of top players
        var job = new cronJob( '00 59 23 * * 0', function(){
            throwCounter.announceTopPlayers(that.getUsers()._value.members, function(error,response){
                if( error ){
                    console.error( error );
                }else{
                    that.postMessage( "ducks", response, {as_user: true } );
                }   
            });
        });

        job.start();
        if( job.running ){  
            console.log( "Job to post throw winners is running" );
        }else{
            console.log( "Error: Job to post throw winners failed" );
        }
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
        //Get data for the user that sent the message
        var userFrom = this.users.filter( function( obj ){
            return obj.id == message.user;
        });
        userFrom = userFrom[0];

        //Check that we are getting a chat message
        if( message.type === 'message' && Boolean(message.text) && typeof message.channel === 'string' && message.user !== this.self.id ){
            //Check if the message was directed at the bot
            if( message.text.indexOf("<@"+this.self.id+">") !== -1 ){
                //Message without @username
                var messageText = message.text.split( "<@"+this.self.id+">" )[1].toLowerCase();
                //messageText without spaces
                var messageTextNoSpaces = messageText.replace(/ /g,'');
                
                //If the user wants the next practice
                if( new RegExp("/|nextpractices|/").test(messageTextNoSpaces) ){
                    events.getNextPractices( 3, function( error, response ){
                        if( error ){
                            console.error( error );
                        }else{
                            that.postMessage( message.channel, response, {as_user: true} );
                        }
                    });
                } 
                else if( new RegExp("/|nextpractice|/").test(messageTextNoSpaces) ){
                    events.getNextPractices( 1, function( error, response ){
                        if( error ){
                            console.error( error );
                        }else{
                            that.postMessage( message.channel, response, {as_user: true} );
                        }
                    });
                } 

                //If the user wants the next tournament
                if( new RegExp("/|nexttournaments|/").test(messageTextNoSpaces) ){
                    events.getNextTournaments( 3, function( error, response ){
                        if( error ){
                            console.error( error );
                        }else{
                            that.postMessage( message.channel, response, {as_user: true} );
                        }
                    });
                } 
                else if( new RegExp("/|nexttournament|/").test(messageTextNoSpaces) ){
                    events.getNextTournaments( 1, function( error, response ){
                        if( error ){
                            console.error( error );
                        }else{
                            that.postMessage( message.channel, response, {as_user: true} );
                        }
                    });
                } 


                //If the user asks for a definition
                if( new RegExp("/|define |def |dict |dictionary |what is |who is |what are |whats a |/").test(messageText) ){
                    this.postMessage(message.channel,dictionaryParser.parseString(message.text),{as_user: true});
                }
                
                //If the user wants to add throws
                if( new RegExp("/|addthrows|/").test(messageTextNoSpaces) ){
                    //Get all numbers from text
                    var numArray = messageText.match(/\d+/);
                    //Get number of throws from text
                    if( numArray != null ){
                        var numThrows = Number(numArray[0]);
                        throwCounter.addThrows( userFrom.id, numThrows, function( error, response ){
                            if( error ){
                                console.error( error );
                            }else{
                                that.postMessage(message.channel, userFrom.name+response, {as_user: true});
                            }
                        });
                    }
                }
                //If the user wants to subtract throws
                else if( new RegExp("/|subthrows|subtractthrows|/").test(messageTextNoSpaces) ){
                    //Get all numbers from text
                    var numArray = messageText.match(/\d+/);
                    //Get number of throws from text
                    if( numArray != null ){
                        var numThrows = Number(numArray[0]);
                        throwCounter.addThrows( userFrom.id, numThrows*-1, function( error, response ){
                            if( error ){
                                console.error( error );
                            }else{
                                that.postMessage(message.channel, userFrom.name+response, {as_user: true});
                            }
                        });
                    }
                }
                //If the user wants to get the top throwers
                else if( new RegExp("/|topthrows|throwsleaderboard|throwsleaders|/").test( messageTextNoSpaces )){
                    throwCounter.getTopPlayers(that.users, function(error,response){
                        if( error ){
                            console.error( error );
                        }else{
                            that.postMessage( message.channel, response, {as_user: true } );
                        }   
                    });
                }
                //If the user wants to get there throw count
                else if( new RegExp("/|throws|/").test(messageText) ){
                    throwCounter.getThrows( userFrom.id, function( error, response ){
                            if( error ){
                                console.error( error );
                                return;
                            }
                            that.postMessage(message.channel, userFrom.name+response, {as_user: true});
                    });  
                }
                //If the user wants to join a line
                if( new RegExp("/|joinline|/").test( messageTextNoSpaces ) ){
                    //Get line to join
                    var args = messageTextNoSpaces.split( "line" )[1];
                    if( args ){
                        lines.joinLine( userFrom.id, args, function( error, response ){
                            if( error ){
                                console.error( error );
                                return;
                            }
                            that.postMessage( message.channel, userFrom.name+response, {as_user: true });
                        });
                    }
                    
                }
                //If the user wants to see his/her line
                else if( messageTextNoSpaces == "line" ){
                    lines.getLine( userFrom.id, function( error, response ){
                        if( error ){
                            console.error( error );
                            return;
                        }
                        that.postMessage( message.channel, userFrom.name+response, {as_user: true});
                    });
                }
                //If the user wants to get all the players from a line
                else if( new RegExp( "/|line|/" ).test( messageTextNoSpaces ) ){
                    var args = messageTextNoSpaces.split( "line" )[0];
                    if( args ){
                        lines.getLinePlayers( args, that.users, function( error, response ){
                            that.postMessage( message.channel, response, {as_user: true} );
                        });
                    }
                }
                //If the user wants to see the weather for today:
                if(new RegExp("/|weathertoday|weather|/").test(messageTextNoSpaces)){
                    weather.getWeather( 0, function( error, response ){
                        if(error){
                            console.error( error );
                        }else{
                            that.postMessage(message.channel, response, {as_user: true});
                        }
                    });
                }
                //if the user wants to see tomorrow's weather:
                else if(new RegExp("/|weathertomorrow|/").test(messageTextNoSpaces)){
                    weather.getWeather(1, function(error, response){
                        if(error){
                            console.error(error);
                        }else{
                            that.postMessage(message.channel, response, {as_user: true});
                        }
                    });
                }
                //if the user wants to see the week's weather:
                else if(new RegExp("/|weatherweek|weatherthisweek|/").test(messageTextNoSpaces)){
                    weather.getWeather(2, function(error, response){
                        if(error){
                            console.error(error);
                        }else{
                            that.postMessage(message.channel, response, {as_user: true});
                        }
                    });
                }
                //If the user has asked for a help menu
                if( messageTextNoSpaces == "help" ){
                    this.postMessage(message.channel,helpMessage,{as_user: true});
                }
                if ( new RegExp("googledrive").test(messageTextNoSpaces) ) {
                    this.postMessage(message.channel, "https://drive.google.com/open?id=0B1ui18qNXOgkSUd5ZnlPUnhSZkU", {as_user: true});
                }
                
                //If the user has asked for the source code
                if( messageTextNoSpaces == "source" ||  messageTextNoSpaces == "sourcecode" || messageTextNoSpaces == "code" ){
                    this.postMessage(message.channel,"https://github.com/JonahMania/Oswald",{as_user: true});
                }
            } else {
                var messageLowerCase = message.text.toLowerCase();

                if ( new RegExp("@(saisai|psipsi)").test(messageLowerCase)) {
                    var users = this.getSaiSaiUsers();
                    var str = "";

                    for (var i = 0; i < users.length; i++) {
                        str += "<@" + users[i].id + "> ";
                    }
                    this.postMessage(message.channel, str, {as_user: true});
                }
            }
        }
    }

    getSaiSaiUsers() {
        var ret = [];
        ret.push(this.findUserByName("elmo"));
        ret.push(this.findUserByName("tjthepianoman"));
        ret.push(this.findUserByName("cutty"));
        ret.push(this.findUserByName("bobkov"));
        ret.push(this.findUserByName("dad"));
        ret.push(this.findUserByName("tony_white"));
        
        return ret;
    }
    findUserByName(name) {
        return this.users.filter(function(obj) {
            return obj.name == name;
        })[0];
    }
}

module.exports = Oswald;
