document.addEventListener('DOMContentLoaded', function () {
    const inputCity = document.getElementById('input-city');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const historyList = document.getElementById('history-list');
    const apiKey = 'e06830fae50fe82ed4d0b8023f6ee523';
    const baseWeatherURL = 'https://api.openweathermap.org'
    var cityHistory = [];

    function getWeatherURL(cityName) {
        const weatherURL = `${baseWeatherURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
        return fetch(weatherURL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function (data) {
                console.log('API Data:', data);
                const lat = data[0].lat;
                const lon = data[0].lon;
                console.log(lat);
                console.log(lon);
                return { lat, lon };
            })
            .catch(function (error) {
                console.error('Fetch URL Error:', error);
                throw error; // Re-throw the error so it can be caught by the caller
            });
    }

    function getLatLonURL(lat, lon) {
        const latLonURL = `${baseWeatherURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
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
    }
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

    searchBtn.addEventListener('click', function () {
        const cityName = inputCity.value;
        getWeatherURL(cityName)
            .then(({ lat, lon }) => {
                if (lat && lon) {
                    getLatLonURL(lat, lon);
                    cityHistory.push(cityName);
                    updateHistory();
                } else {
                    console.error('Latitude and Longitude are not available.');
                }
            })
            .catch(error => {
                console.error('Error processing weather data:', error);
            });
    });

    clearBtn.addEventListener('click', function () {

        cityHistory.length = 0;
        updateHistory();
    });


});
