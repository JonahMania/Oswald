const db = require('./database').players;

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


module.exports.insertPlayer = insertPlayer;
module.exports.getPlayerByName = getPlayerByName;
module.exports.updatePlayer = updatePlayer;
