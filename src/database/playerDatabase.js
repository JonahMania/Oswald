const db = require('./database').players;
const moment = require('moment');
/**
* Inserts a new player with his initial throws into the database
* @param {object} player object with fields name and throws to insert in the database
* @param {function} callback function to fire when insert is complete
*/
function insertPlayer( player, callback ){
    db.insert( player, callback );
}

/**
* Finds a plauer object with a given name
* @param {string} playerName name of the player to look up
* @param {function} callback function to fire when player is found
*/
function getPlayerByName( playerName, callback ){
    db.find( { name: playerName }, callback );
}

/**
* Updates a player in the database
* @param {string} playerName the name of the player to update
* @param {object} player object with fields name and throws to update in the database
* @param {function} callback function to fire when update is complete
*/
function updatePlayer( playerName, player, callback ){
    db.update( { name: playerName }, player, { returnUpdatedDocs: true }, callback );
}

/**
* Gets the 3 players with the highest total throws
* @param {function} callback function to fire when players are found
*/
function getTopTotalThrows( callback ){
    db.find({}).sort({ throws: -1 }).limit(3).exec(callback);
}

/**
* Gets the 3 players with the highest week throws
* @param {function} callback function to fire when players are found
*/
function getTopWeekThrows( callback ){
    var week = moment().format('W');
    var year = moment().format('YYYY');
    var search = 'throws.'+year+'.'+week;

    db.find({}).sort({[search]:-1}).limit(3).exec(callback);
}
/**
* Gets all the players from a line
* @param {string} lineName
* @param {function} callback
*/
function getLinePlayers( lineName, callback ){
    db.find({line:lineName}).exec(callback);
}
/**
* Gets a sorted list of top lines 
* @param {function} callback
*/
function getLineThrows( callback ){
    var week = moment().format('W');
    var year = moment().format('YYYY');   
    db.find({}).exec(function( error,docs ){
        if( error ){
            callback( error, null );
            return;
        }
        var lineThrows = {};
        var lineThrowsArray = [];
        docs.forEach( function( player ){
            if( !player.line || !player.throws || !player.throws[year] || !player.throws[year][week] ){
                return;
            }
            if( !lineThrows[player.line] ){
                lineThrows[player.line] = 0;
            }
            lineThrows[player.line] += player.throws[year][week];
        });
        //Add each line to the array
        for( var line in lineThrows ){
            lineThrowsArray.push({
                "name":line,
                "throws":lineThrows[line]
            });
        }
        //Sort by throws
        lineThrowsArray.sort( function( a, b ){
            return a.throws < b.throws;
        });
        callback( null, lineThrowsArray );     
    });
}
module.exports.insertPlayer = insertPlayer;
module.exports.getPlayerByName = getPlayerByName;
module.exports.updatePlayer = updatePlayer;
module.exports.getTopTotalThrows = getTopTotalThrows;
module.exports.getTopWeekThrows = getTopWeekThrows;
module.exports.getLinePlayers = getLinePlayers;
module.exports.getLineThrows = getLineThrows;
