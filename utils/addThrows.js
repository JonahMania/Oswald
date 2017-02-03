/*
* Node script to add throws to a player on a specific week
* this is useful for when I have to update throws in the database
*/
const playerDatabase = require('../src/database/playerDatabase');

const usage = "addThrows [userId] [year] [week] [number of throws] "; 

//Get commandline arguments
args = [];

process.argv.forEach((val, index) => {
  args.push( val );
});

//Check for command line argument length
if( args.length < 6 || args.length > 6 ){
    console.error( "Usage: "+usage );
    return 1;
}
//Check argument type
if( isNaN( args[3] ) ){
    console.error( "Argument [year] must be of type number" );
    console.error( "Usage: "+usage );
    return 1; 
}
 
if( isNaN( args[4] ) ){
    console.error( "Argument [week] must be of type number" );
    console.error( "Usage: "+usage );
    return 1; 
} 

if( isNaN( args[5] ) ){
    console.error( "Argument [number of throws] must be of type number" );
    console.error( "Usage: "+usage );
    return 1;
}

var year = args[3];
var week = args[4];
var throws = Number( args[5] );

playerDatabase.getPlayerByName( args[2], function( error, player ){
    if( error ){
        console.error( error );
    }else if( player.length == 0 ){
        console.error( "Could not find player with name", args[2], "creating player" );
        player = {};
        player.name = args[2];
        player.throws = {};
        player.throws.total = throws;
        player.throws[year] = {};
        player.throws[year][week] = throws;
        playerDatabase.insertPlayer( player, function( error, newPlayer ){
            if( error ){
                console.error( error );
            }else{
                console.log( newPlayer );
            }
        })
    }else{
        player = player[0];
        //Make sure the object we want to edit is in the object
        if( !player.throws ){
            player.throws = {};
        }
        if( !player.throws.total ){
            player.throws.total = 0;
        }
        if( !player.throws[year] ){
            player.throws[year] = {};
        }
        if( !player.throws[year][week] ){
            player.throws[year][week] = 0;
        }
        //Add to throws
        player.throws[year][week] += throws;
        player.throws.total += throws;
        console.log( player );
        //Update db
        playerDatabase.updatePlayer( player.name, player, function( error, newPlayer ){
            if( error ){
                console.error( error );
            }else{
                console.log( newPlayer );
            }
        });
    }
});

