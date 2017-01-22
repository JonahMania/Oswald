const playerDatabase = require("../database/playerDatabase");

/**
* Adds a number of throws to a player in the database player will be created if they do not exist
* @param {string} playerName name of the player to add to
* @param {integer} numThrows the number of throws to add
* @param {function} callback function to fire when insert is complete will
* return the number of new throws
*/
function addThrows( playerName, numThrows, callback ){
    playerDatabase.getPlayerByName( playerName, function( error, players ){
        if( error ){
            callback( error, null );
        }else if( players.length == 0 ){
            //If there are no players in the database with this name insert one
            var player = {
                name: playerName,
                throws: numThrows
            }
            //Insert new player into database
            playerDatabase.insertPlayer( player, function( error, newPlayer ){
                if(error){
                    callback( error, null );
                }else{
                    callback( null, newPlayer.throws );
                }
            });
            
        }else{
            //If the player does exist update it
            var player = players[0];
            //Add throws to player object
            if( player.throws ){
                player.throws += numThrows;
            }else{
                player.throws = numThrows;
            }
            //Update player in database
            playerDatabase.updatePlayer( playerName, player, function( error, numAffected, newPlayer ){
                if( error ){
                    callback( error, null );   
                }else{
                    callback( null, newPlayer.throws );
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
    playerDatabase.getPlayerByName( playerName, function( error, players ){
        if( error ){
            callback(error,null);
        }else{
            if( players.length > 0 ){
                callback(null, players[0].throws );
            }else{
                callback("Error: 0 players in selection", null );
            }
        }
    });
}

module.exports.addThrows = addThrows;
module.exports.getThrows = getThrows;
