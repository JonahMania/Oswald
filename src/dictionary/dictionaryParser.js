const fs = require('fs');
const path = require('path');

var dictionary = [];

//Load add definitions into the dictionary
loadAll();

/**
* Reads a single json file
* @param {string} filePath path to a json file
* @return {object}
*/
function loadDictionary( filePath ){
    var fullPath = path.join( __dirname, filePath );
    return JSON.parse( fs.readFileSync( fullPath, { encoding: 'utf-8' } ) );
}
/**
* Loads all the json files in the definitions file into the dictionary object
*/
function loadAll(){
    //Full path to defintions folder
    var fullPath = path.join( __dirname, "definitions" );
    var definition = {};
    //Read all json files in the definitions folder
    fs.readdirSync( fullPath, { encoding: 'utf-8' } ).forEach( function( definitionPath ){
        //Load the definiton file
        definition = loadDictionary( "definitions/"+definitionPath );
        //Merge new definitions into the dictionary
        definition.forEach( function( entry){
            dictionary.push( entry );
        });
    }); 
}

/**
* Takes a string of space separated words and returns a string of found definitions
* @param {string} argumentString The string of words to look up in the dictionary
*/
function parseString( argumentString ){
    //Return string
    var ret = "";
    var cleanString;
   //Clean the string to ignore case and question marks
    cleanString = argumentString.replace('?','');
    cleanString = cleanString.toLowerCase();
    //Look at all words in dictionary
    dictionary.forEach(function(word){
        for( var i in word.keywords ){
            if( cleanString.indexOf(word.keywords[i]) !== -1 ){
                ret += word.word + ": " + word.desc + "\n";
                break;
            }
        }
    });
    //If no definitions were found return a error message
    if( ret === "" ){
        ret = "I have found no definitions that match your request";
    }
    //Removes the last character of the string if it is a \n char
    return ret.replace(/\n$/, "");
}

module.exports.parseString = parseString;
