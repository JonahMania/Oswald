const moment = require("moment");
const playerDatabase = require("../database/playerDatabase");

const lines = require( "../lines/lines" );
const medals = {
    0:":goldmedal:", 
    1:":silvermedal:",
    2:":bronzemedal:"
}

/**
* Adds a number of throws to a player in the database player will be created if they do not exist
* @param {string} playerName name of the player to add to
* @param {integer} numThrows the number of throws to add
* @param {function} callback function to fire when insert is complete will
* return the number of new throws
*/
function addThrows( playerName, numThrows, callback ){
    if( !playerName ){
        callback("Error: Must pass player name", null);
        return;
    }
    if( !numThrows || typeof numThrows != "number" ){
        callback("Error: Must pass a numThrows as a number" );
        return;
    }
    var week = moment().format('W');
    var year = moment().format('YYYY');
    playerDatabase.getPlayerByName( playerName, function( error, players ){
        if( error ){
            callback( error, null );
        }else if( players.length == 0 ){
            //If there are no players in the database with this name insert one
            var player = {
                _id: playerName,
                throws: {
                    total:numThrows
                }
            }
            player.throws[year] = {}; 
            player.throws[year][week] = numThrows;
            if( player.throws[year][week] < 0 ){
                player.throws[year][week] = 0;
            }
            if( player.throws.total < 0 ){
                player.throws.total = 0;
            }
            //Insert new player into database
            playerDatabase.insertPlayer( player, function( error, newPlayer ){
                if(error){
                    callback( error, null );
                }else{
                    var response = " has "+newPlayer.throws[year][week]+" throws this week and a total of "+
                        newPlayer.throws.total+" throws";
                    callback( null, response );
                }
            });   
        }else{
            //If the player does exist update it
            var player = players[0];
            var currThrows = 0;
            var currTotal = 0;

            if( player.throws && player.throws[year] && player.throws[year][week] ){
                currThrows = player.throws[year][week];
            }
            
            if( player.throws && player.throws.total ){
                currTotal = player.throws.total;
            }
   
            currThrows += numThrows;
 
            if( currThrows < 0 ){
                //If the player now has less then 0 throws make the player have 0 throws for the week and subtract from total
                var overflow = Math.abs(numThrows) + currThrows;
                currThrows = 0;
                currTotal -= overflow;
            }else{
                currTotal += numThrows;
            }
            //Make sure the total is not less then 0
            if( currTotal < 0 ){
                currTotal = 0;
            }
            
            //Update player in database
            playerDatabase.updateThrows( playerName, year, week, currThrows, currTotal, function( error, numAffected, newPlayer ){
                if( error ){
                    callback( error, null );   
                }else{
                    var response = " has "+newPlayer.throws[year][week]+" throws this week and a total of "+
                    newPlayer.throws.total+" throws";
                    callback( null, response );
                }
            });                 
        }
    });
}

/**
* Gets the number of throws for a player
* @param {string} playerName the name of the player to get throws from
* @param {function} callback function to fire and return number of throws
*/
function getThrows( playerName, callback ){
    var week = moment().format('W');
    var year = moment().format('YYYY');
   
    playerDatabase.getPlayerByName( playerName, function( error, players ){
        if( error ){
            callback(error,null);
        }else{
            if( players.length > 0 ){
                var response = "";
                //Check if the player has any throws this week and append the correct message
                if( players[0].throws[year][week] ){
                    response += " has "+players[0].throws[year][week]+" throws this week and a total of ";
                }else{
                    response += " has 0 throws this week and a total of "
                }
                //Check if the player has any total throws and add the correct message
                if( players[0].throws.total ){
                    response += players[0].throws.total+" throws"
                }else{
                    response += " 0 throws";
                }
                callback(null, response );
            }else{
                callback(null," has 0 throws this week and a total of 0 throws" );
            }
        }
    });
}

/**
* Get the top three players of the week and the top three players of all time
*/
function getTopPlayers(users, callback){
    //Get the top total throws
    playerDatabase.getTopTotalThrows( function( error, docs ){
        if( error ){
            callback( error, null );
            return;
        }
        var week = moment().format('W');
        var year = moment().format('YYYY');
        
        //Get the top players for the week
        playerDatabase.getTopWeekThrows( function( error, weekDocs ){
            if( error ){
                callback( error, null )
                return;
            }
            //Get the top lines for the week
            playerDatabase.getLineThrows( function( error, lineDocs ){   
                if( error ){
                    callback( error, null );
                    return;
                }
                //Add top lines for the week
                var message = "Current Top lines for the week";
                if( lineDocs.length == 0 ){
                    message += "\n None";
                }
                for( var i = 0; i < Math.min( 3, lineDocs.length ); i++ ){
                    message += "\n" +medals[i] + " " + lineDocs[i].name + " with " + lineDocs[i].throws;
                }
               
                //Add top players for the week
                message += "\n\nCurrent Top Players for the Week";
                if( weekDocs.length == 0 ){
                    message += "\n None";
                }               
                weekDocs.forEach(function( player, i ){
                    var user = users.filter(function( obj ){
                        return obj.id == player._id;
                    });
                    if( user.length < 1 ){
                        return;
                    }else{
                        user = user[0].name;
                    }
                    message += "\n" + medals[i] + " " + user +" with "+player.throws[year][week];
                });
                //Add top all time players
                message += "\n\nCurrent Total Throw Champions";
                if( docs.length == 0 ){
                    message += "\n None";
                }
                docs.forEach(function( player, i ){
                    var user = users.filter(function( obj ){
                        return obj.id == player._id;
                    });
                    if( user.length < 1 ){
                        return;
                    }else{
                        user = user[0].name;
                    }
                    message += "\n" + medals[i] + " " + user +" with "+player.throws.total;
                });
                callback( null, message );
            });
                       
        });
        
    });
}

function announceTopPlayers(users,callback){
    var week = moment().format('W');
    var year = moment().format('YYYY');
    playerDatabase.getTopWeekThrows( function( error, weekDocs ){
        if( error ){
            callback( error, null );
            return;
        }
        playerDatabase.getLineThrows( function( error, lineDocs ){
            if( error ){
                callback( error, null );
                return;
            }
            //Add top lines of the week
            var message = "Top lines this week";
            if( lineDocs.length == 0 ){
                message += "\n None";
            }
            for( var i = 0; i < Math.min( 3, lineDocs.length ); i++ ){
                message += "\n" +medals[i] + " " + lineDocs[i].name + " with " + lineDocs[i].throws;
            }
            //Add top players of the week
            message += "\n\nThrow Champions for the Week";   
            weekDocs.forEach(function( player, i ){
                var user = users.filter(function( obj ){
                    return obj.id == player._id;
                });
                if( user.length < 1 ){
                    return;
                }else{
                    user = user[0].name;
                }
                message += "\n" + medals[i] + " " + user +" with "+player.throws[year][week];
            });

            callback( null, message );
        });
    });
}

module.exports.addThrows = addThrows;
module.exports.getThrows = getThrows;
module.exports.getTopPlayers = getTopPlayers;
module.exports.announceTopPlayers = announceTopPlayers;
