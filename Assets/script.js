
var inputCity = document.getElementById('input-city');
var searchBtn = document.getElementById('search-btn');
var clearBtn = document.getElementById('clear-btn');
var enterKey = document.querySelector('#input-city.form-control.me-2');

function getWeatherURL() {
    var apiKey = 'e06830fae50fe82ed4d0b8023f6ee523';
    var cityName = inputCity.value;
    console.log('City Name:', cityName);
    console.log('API Key:', apiKey);
    var weatherURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;
    console.log('Weather URL:', weatherURL);

    fetch(weatherURL)
        .then(function (response) {
            console.log('Fetch Response:', response);
            return response.json();
        })
        .then(function (data) {
            console.log('API Data:', data);
        })
        .catch(function (error) {
            console.log('Fetch Error:', error);
        });
}
enterKey.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        // console.log('Enter key works');
        getWeatherURL();
    }
})

searchBtn.addEventListener('click', getWeatherURL)

clearBtn.addEventListener('click', function () {
    console.log('test if  clear btn working');
})