// Wait for the DOM to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function () {
    // Get references to HTML elements
    const inputCity = document.getElementById('input-city');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const apiKey = 'e06830fae50fe82ed4d0b8023f6ee523';
    const baseWeatherURL = 'https://api.openweathermap.org';
    var cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];

    // Function to update the city history list in the HTML and save to localStorage
    function updateHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = ''; // Clear existing content

        // Iterate through cityHistory and create buttons for each city
        cityHistory.forEach(city => {
            const buttonItem = document.createElement('button');
            buttonItem.textContent = city;
            buttonItem.classList.add('btn', 'btn-light', 'history-button');
            buttonItem.addEventListener('click', function () {
                // Handle history item click by fetching weather for the selected city
                getWeather(city);
            });
            historyList.appendChild(buttonItem);
        });

        // Save updated history to localStorage
        localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
    }

    // Function to fetch the weather URL for a given city
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

    // Function to fetch the weather forecast for a given latitude and longitude
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
                const todayIconCode = todayWeather.weather[0].icon; // Get the weather icon code for today

                todayWeatherDiv.innerHTML += `
                    <div>
                        <img src="https://openweathermap.org/img/w/${todayIconCode}.png" alt="Weather Icon"> <!-- Display today's weather icon -->
                        <p>Temperature: ${todayWeather.main.temp} °F</p>
                        <p>Humidity: ${todayWeather.main.humidity}%</p>
                        <p>Wind Speed: ${todayWeather.wind.speed} mph</p>
                    </div>
                `;

                // Update the 5-day forecast
                const forecastDivs = ['tomorrow-forecast', 'day2-forecast', 'day3-forecast', 'day4-forecast', 'day5-forecast'];

                let currentIndex = data.list.indexOf(todayWeather) + 8; // Initialize with the next day's index

                for (let i = 0; i < forecastDivs.length; i++) {
                    console.log('Current Index:', currentIndex);

                    // Check if the current index is within the bounds of the forecast list
                    if (currentIndex < data.list.length) {
                        const forecast = data.list[currentIndex];
                        const forecastDate = new Date(forecast.dt * 1000).toDateString();
                        const iconCode = forecast.weather[0].icon; // Get the weather icon code

                        const forecastDiv = document.getElementById(forecastDivs[i]);
                        forecastDiv.innerHTML = ''; // Clear existing content before appending
                        forecastDiv.innerHTML += `
                            <div class="day-container">
                                <h5>${forecastDate}</h5>
                                <div>
                                    <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon"> <!-- Display weather icon -->
                                    <p>Temperature: ${forecast.main.temp} °F</p>
                                    <p>Humidity: ${forecast.main.humidity}%</p>
                                    <p>Wind Speed: ${forecast.wind.speed} mph</p>
                                </div>
                            </div>
                        `;
                    } else {
                        console.error('Index out of bounds:', currentIndex);
                        currentIndex = data.list.length - 1; // Set it to the last index (39)
                    }

                    currentIndex += 8;
                    if (currentIndex >= data.list.length) {
                        currentIndex = data.list.length - 1; // Set it to the last index (39)
                    }
                }

            })
            .catch(function (error) {
                console.log('Fetch LatLon Error:', error);
            });
    }

    // Function to fetch weather for a given city
    function getWeather(cityName) {
        getWeatherURL(cityName)
            .then(({ lat, lon }) => {
                if (lat && lon) {
                    getLatLonURL(lat, lon);
                    // Add the city to history only if it's not already in the history
                    if (!cityHistory.includes(cityName)) {
                        cityHistory.push(cityName);
                        updateHistory();
                    }
                } else {
                    console.error('Latitude and Longitude are not available.');
                }
            })
            .catch(error => {
                console.error('Error processing weather data:', error);
            });
    }

    // Event listener for the search button click
    searchBtn.addEventListener('click', function () {
        const cityName = inputCity.value;
        getWeather(cityName);
    });

    // Event listener for the clear button click
    clearBtn.addEventListener('click', function () {
        cityHistory.length = 0;
        updateHistory();
        location.reload(); // Reload the page
    });

    // Initial history update
    updateHistory();
});
