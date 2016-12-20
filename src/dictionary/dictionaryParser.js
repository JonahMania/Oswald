const dictionary = require("./dictionary");
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
