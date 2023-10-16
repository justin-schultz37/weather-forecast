document.addEventListener('DOMContentLoaded', function () {
    var inputCity = document.getElementById('input-city');
    var searchBtn = document.getElementById('search-btn');
    var clearBtn = document.getElementById('clear-btn');
    var historyList = document.getElementById('history-list');
    var apiKey = 'e06830fae50fe82ed4d0b8023f6ee523';
    var cityHistory = [];

    function getWeatherURL(cityName) {
        var weatherURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;
        fetch(weatherURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('API Data:', data);
            })
            .catch(function (error) {
                console.log('Fetch Error:', error);
            });
    }

    searchBtn.addEventListener('click', function () {
        var cityName = inputCity.value;
        getWeatherURL(cityName);
        // Add the city name to the history
        cityHistory.push(cityName);
        updateHistory();
    });

    clearBtn.addEventListener('click', function () {

        cityHistory = [];
        updateHistory();
    });

    function updateHistory() {
        // Clear the history list
        historyList.innerHTML = '';
        // Add city names to the history list
        cityHistory.forEach(function (city) {
            var listItem = document.createElement('li');
            listItem.textContent = city;
            historyList.appendChild(listItem);
        });
    }
});
