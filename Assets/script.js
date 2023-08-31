
var inputCity = document.getElementById('input-city');
var searchBtn = document.getElementById('search-btn');
var clearBtn = document.getElementById('clear-btn');

function getWeatherURL() {
    var apiKey = 'e06830fae50fe82ed4d0b8023f6ee523';
    var cityName = inputCity.value;
    console.log(cityName);
    console.log(apiKey);
    var weatherURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;
    console.log(weatherURL);
}

searchBtn.addEventListener('click', getWeatherURL)
console.log('test if search btn working');

clearBtn.addEventListener('click', function () {
    console.log('test if  clear btn working');
})