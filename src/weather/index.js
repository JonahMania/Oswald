let request = require('request');
let city = 'hoboken';

/**
* Gets the next practices as a formatted string
* @param {int} option The option for which to run the getWeather [0 = today], [1 = tomorrow], [2 = this week]
* @param {function} callback Function to run when weather is recieved takes
* arguments error and response
*/

var getWeather = function(option, callback){
  //Load client secrets from a local file.
  fs.readFile('credentials/weather_secret.json', function processClientSecrets(error, content) {
      if(error){
          callback(error,null);
          return;
      }
      // Authorize a client with the loaded credentials, then call the
      // OpenWeatherMap API.
      else{
        let apiKey = JSON.parse(content)
        if(option == 0){
          let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        }
        else if(option == 1){
          let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
        }
        else{
          //7 days, imperial units, by city
          let url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&appid=${apiKey}&units=imperial&cnt=7`
        }
        request(url, function (err, response, body) {
          if(err){
            callback('Error with key: ' + error, null);
          }
          else {
            let weather = JSON.parse(body)
            let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
            console.log(message);
          }
        }
      }
    }
  });
}
