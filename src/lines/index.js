const playerDatabase = require( '../database/playerDatabase' );
const lines = require( "./lines" ); 

/**
 * Sets a line in to a player in the player database
 * @param {string} playerName
 * @param {string} line
 * @param {function} callback Function to fire when change is complete
 */
function joinLine( playerName, line, callback ){
    var i = -1;
    //Check arguments
    if( !playerName ){
        callback( "Error: Must pass player name", null );
        return;
    }
    if( !line ){
        callback( "Error: Must pass line name", null );
        return;
    }

    for( var j in lines )
    {
        if (lines[j].keywords.indexOf(line) >= 0) {
            i = j;
        }
    }

    if( i == -1) {//lines[i].keywords.indexOf( line ) < 0 ){
        callback( null, ', I could not find a line named "' + line + '"' );
        return;
    }

    //Get player
    playerDatabase.getPlayerByName( playerName, function( error, players ){
        var player = {};
        if( error ){
            callback( error, null );
            return;
        };

        if( players.length == 0 ){
            //No player in database so add him
            player = {
                name: playerName,
                line: lines[i].line
            }
            //Insert Player
            playerDatabase.insertPlayer( player, function( error, newPlayer ){
                if( error ){
                    callback( error, null );
                    return;
                }
                var response = " has joined line " + newPlayer.line;
                callback( null, response );
            });
        }else{
            //If a player was found then add the line name to that player
            player = players[0];
            player.line = lines[i].line;
            //Update database
            playerDatabase.updatePlayer( playerName, player, function( error, newPlayer ){
                if( error ){
                    callback( error, null );
                    return;
                }
                var response = " has joined line " + line;
                callback( null, response );
            });
        }
    });
}
/**
 * Returns the name of the line a player is in
 * @param {string} playerName
 * @param {function} callback function to fire when line is found
 */
function getLine( playerName, callback ){
    //Check arguments
    if( !playerName ){
        callback( "Error: Must pass player name", null );
        return;
    }
    playerDatabase.getPlayerByName( playerName, function( error, players ){
        if( error ){
            callback( error, null );
            return;
        }
        var response = "";
        var player;
        if( players.length == 0 || !players[0].line ){
            response = ', You have not joined a line yet. Join with the command " join line [line name] "';
            callback( null, response );
            return;
        }
        player = players[0];
        response = " is assigned to "+player.line+" line";
        callback( null, response );        
    });
}
/**
 * Returns all the players of a line
 * @param {string} line
 * @param {object} users An object containing all the mappings of usernames to userIds from slack
 * @param {function} callback
 */
function getLinePlayers( line, users, callback ){
    //Check arguments
    if( !line ){
        callback( "Error: Must pass a line name", null );
        return;
    }
    var found = -1;
    var message = "";
    var currUser = {};
    for (var i in lines) {
        if (lines[i].line == line || lines[i].keywords.indexOf(line) >= 0) {
            found = i;
        }
    }
    if (found === -1) {
        message = "Could not find a line with name "+line;
        callback( null, message );
        return;
    }
    line = lines[found].line;
    message = line +" line players\n";
    //Get all players from the requested line
    playerDatabase.getLinePlayers( line, function( error, players ){
        if( players.length == 0 ){
            message = "No players in "+line+" line";
            callback( null, message );
            return;
        }
        //Add the names of each player
        players.forEach( function( player ){
            currUser = users.filter( function( obj ){
                return obj.id == player.name;
            });
            if( currUser.length > 0 ){
                currUser = currUser[0];
                message += currUser.profile.first_name+" "+currUser.profile.last_name+" ( "+currUser.name+" ) "+"\n";
            }
        });
        callback( null, message );
    });
}

module.exports.joinLine = joinLine;
module.exports.getLine = getLine;
module.exports.getLinePlayers = getLinePlayers;

