const parseEvent = require("./parseEvent");
/**
* Returns a formatted string of the next practice
* @param {object} data Raw data from google calendar
*/
var getNext = function( data ){
    var ret = "";
    //If there are now future events
    if( data.items.length === 0 ){
        return "There are no upcoming practices"
    }
    //Return the parsed event
    data.items.forEach(function(practice, index){
        //Add space between events
        if( index != 0 ){
            ret += "\n\n";
        }
        ret += parseEvent( practice );
    })
    return ret;
}

module.exports.getNext = getNext;
