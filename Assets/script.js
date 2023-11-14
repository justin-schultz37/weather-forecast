document.addEventListener('DOMContentLoaded', function () {
    const inputCity = document.getElementById('input-city');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const apiKey = 'e06830fae50fe82ed4d0b8023f6ee523';
    const baseWeatherURL = 'https://api.openweathermap.org'
    var cityHistory = [];

    function updateHistory() {
        // Update the city history list in the HTML
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = ''; // Clear existing content

        cityHistory.forEach(city => {
            const listItem = document.createElement('li');
            listItem.textContent = city;
            historyList.appendChild(listItem);
        });
    }

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
                console.log('Latitude:', lat);
                console.log('Longitude:', lon);
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

                // Clear the existing content in the 'today-weather-data' div
                const todayWeatherDiv = document.getElementById('today-weather-data');
                todayWeatherDiv.innerHTML = '';

                // Display today's date
                const todayDate = new Date().toDateString();
                todayWeatherDiv.innerHTML += `<h6>${todayDate}</h6>`;

                // Display today's weather details
                const todayWeather = data.list[0];
                const todayTime = new Date(todayWeather.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

                todayWeatherDiv.innerHTML += `
                    <div>
                        <p>Time: ${todayTime}</p>
                        <p>Temperature: ${todayWeather.main.temp} °F</p>
                        <p>Humidity: ${todayWeather.main.humidity}%</p>
                        <p>Wind Speed: ${todayWeather.wind.speed} mph</p>
                        <p>Description: ${todayWeather.weather[0].description}</p>
                    </div>
                `;

                // Update the 5-day forecast
                const forecastDivs = ['tomorrow-forecast', 'day2-forecast', 'day3-forecast', 'day4-forecast', 'day5-forecast'];

                let currentIndex = data.list.indexOf(todayWeather);

                for (let i = 0; i < forecastDivs.length; i++) {
                    console.log('Current Index:', currentIndex); // Add this line
                    console.log('Forecast List Length:', data.list.length); // Add this line

                    // Check if the current index is within the bounds of the forecast list
                    if (currentIndex < data.list.length) {
                        const forecast = data.list[currentIndex];

                        const forecastDate = new Date(forecast.dt * 1000).toDateString();
                        const forecastTime = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

                        const forecastDiv = document.getElementById(forecastDivs[i]);
                        forecastDiv.innerHTML = ''; // Clear existing content before appending
                        forecastDiv.innerHTML += `
                            <div class="day-container">
                                <h5>${forecastDate}</h5>
                                <div>
                                    <p>Time: ${forecastTime}</p>
                                    <p>Temperature: ${forecast.main.temp} °F</p>
                                    <p>Humidity: ${forecast.main.humidity}%</p>
                                    <p>Wind Speed: ${forecast.wind.speed} mph</p>
                                    <p>Description: ${forecast.weather[0].description}</p>
                                </div>
                            </div>
                        `;
                    } else {
                        console.error('Index out of bounds:', currentIndex);
                    }

                    currentIndex += 8; // Increase the index by 8 for each subsequent day
                }

            })
            .catch(function (error) {
                console.log('Fetch LatLon Error:', error);
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
