document.addEventListener('DOMContentLoaded', function () {
    const inputCity = document.getElementById('input-city');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const historyList = document.getElementById('history-list');
    const apiKey = 'e06830fae50fe82ed4d0b8023f6ee523';
    var cityHistory = [];

    function getWeatherURL(cityName) {
        const weatherURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;
        fetch(weatherURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('API Data:', data);
                let lat = data[0].lat;
                let lon = data[0].lon;
                console.log(lat);
                console.log(lon);
                getLatLonURL(lat, lon);

            })
            .catch(function (error) {
                console.log('Fetch URL Error:', error);
            });
    }

    function getLatLonURL(lat, lon) {
        const latLonURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
        fetch(latLonURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('LatLon API:', data);
            })
            .catch(function (error) {
                console.log('Fetch LatLon Error:', error);
            });
    };

    searchBtn.addEventListener('click', function () {
        const cityName = inputCity.value;
        getWeatherURL(cityName);
        getLatLonURL();
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
            const listItem = document.createElement('li');
            listItem.textContent = city;
            historyList.appendChild(listItem);
        });
    }
});
