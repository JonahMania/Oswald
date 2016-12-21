const https = require('https');
const fs = require('fs');
var google = require('googleapis');
const authorize = require('./authorize');
const practices = require('./practices');

//Google api links for practice and tournament calendars
const practiceURL = "9h5c4p0859pr36q7h3s8j6qges@group.calendar.google.com";
const tournamentURL = "88b310nv65rmano79sclvvsnms@group.calendar.google.com";

/**
* Load all data from a public google calendar
* @param {string} url The url of a google calendar
* @param {int} maxEvents The max number of events to get from the API
* @param {function} callback Function to run when calendar is recieved takes
* arguments error and data
*/
var loadCalendar = function( url, maxEvents, callback ){
    //Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(error, content) {
        if(error){
            callback(error,null);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Calendar API.
        authorize(JSON.parse(content),function(client){
            var calendar = google.calendar('v3');
            calendar.events.list({
                auth: client,
                calendarId: url,
                //Gets just the latest events
                timeMin: (new Date()).toISOString(),
                maxResults: maxEvents,
                singleEvents: true,
                orderBy: 'startTime'
            },callback);
        });
    });
}

/**
* Gets the next practices as a formatted string
* @param {int} count The max number of practices to get
* @param {function} callback Function to run when calendar is recieved takes
* arguments error and response
*/
var getNextPractices = function( count, callback ){
    loadCalendar(practiceURL,count,function(error,data){
        if(error){
            callback(error,null)
        }else{
            callback(null,practices.getNext(data));
        }
    });
}

module.exports .getNextPractices = getNextPractices;
