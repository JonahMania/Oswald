const dateFormat = require('dateformat');

/**
* Returns a string representation of a single google calendar event
* @param {object} calEvent A sing google calendar event
*/
var parseEvent = function( calEvent ){
    //Date object for start time
    var startDate = new Date( calEvent.start.dateTime )
    //Date object for end time
    var endDate = new Date( calEvent.end.dateTime )

    var title = calEvent.summary;
    var location = calEvent.location;
    var startTime = dateFormat(startDate, "dddd, mmmm dS, yyyy, h:MM TT");
    var endTime = dateFormat(endDate, "dddd, mmmm dS, yyyy, h:MM TT");
    //Return full string
    return title + '\n' +
    'Location: ' + location + '\n' +
    'startTime: ' + startTime + '\n' +
    'endTime: ' + endTime;
}

module.exports = parseEvent;
