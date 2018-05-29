let request = require('request');

let apiKey = '10576fdf11ca5bf5c060e334b73acbab';
let city = 'hoboken';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

function kelvinToCelcius(kelvin) {
  return kelvin - 273.15;
}

function celciusToFahrenheit(celcius) {
  return celcius * 9 / 5 + 32;
}

request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body)
    var kelvin = weather.main.temp;
    var celcius = kelvinToCelcius(kelvin);
    var fahrenheit = String(celciusToFahrenheit(celcius).toFixed(2));
    let message = `It's ${fahrenheit} degrees in ${weather.name}!`;
    console.log(message);
  }
});
