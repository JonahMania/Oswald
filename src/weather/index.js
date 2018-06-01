let request = require('request');
var fs = require("fs");
var date = new Date();
var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";
weekday[7]="Sunday";
weekday[8]="Monday";
weekday[9]="Tuesday";
weekday[10]="Wednesday";
weekday[11]="Thursday";
weekday[12]="Friday";
weekday[13]="Saturday";

var city = "hoboken";
var units = "imperial";

/**
* Gets the next practices as a formatted string
* @param {int} option The option for which to run the getWeather [0 = today], [1 = tomorrow], [2 = this week]
* @param {function} callback Function to run when weather is recieved takes
* arguments error and response
*/
function getWeather(option, callback){
  //Load client secrets from a local file.
  fs.readFile('credentials/weather_secret.json', function processClientSecrets(error, content) {
    if(error){
      callback(error,null);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // OpenWeatherMap API.
    else{
      var apiKey = JSON.parse(content).token;
      if(option == 0){
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        request(url, function (err, response, body) {
          let weather = JSON.parse(body);
          let text = "Today: " + weather.weather[0].main + ", temp: " + weather.main.temp + ", wind: " + weather.wind.speed + " (" + weather.wind.deg + " deg)";
          callback(null, text);
        });
      }
      else if(option == 1){
        let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
        request(url, function (err, response, body) {
          let weather = JSON.parse(body);
          let temp = weather.list[1].main.temp;
          let weather_description = weather.list[1].weather[0].description;
          let text = weekday[date.getDay() + 1] + ": " + weather_description + ", " +  temp + "F";
          callback(null, text);
        });
      }
      else{
        //7 days, imperial units, by city
        let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`
        request(url, function (err, response, body) {
          let weather = JSON.parse(body);
          let temp = []; //5 days, 8 sets of 3 hours per day
          let weather_description = [];
          for(i=1; i<40; i+=8){
            temp.push(weather.list[i].main.temp); //6 a.m.
            weather_description.push(weather.list[i].weather[0].description);
          }
          let text = "";
          for(i=0; i<5; i++){
            text += weekday[date.getDay() + i] + ": " + weather_description[i] + ", " +  temp[i] + "F, "
          }
          callback(null, "(6am each morning): " + text);
        });
      }
    }
  });
}

module.exports.getWeather = getWeather;
