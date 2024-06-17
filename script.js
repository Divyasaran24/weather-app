const apiKey = "c7b96ff781a37d1ff1f570f31f3dc7fd";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const container = document.querySelector('.container');
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const todayDate = document.querySelector('.date');
const todayTime = document.querySelector('.time');
const nameOutput = document.querySelector('.name');
const todayCondition = document.querySelector('.condition');
const icon = document.querySelector('.icon');
const form = document.querySelector('.location');
const search = document.querySelector('.search-form');
const submitBtn = document.querySelector('.submit');
const cloudy = document.querySelector('.cloudy');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const pressure = document.querySelector('.pressure');
const celsiusBtn = document.querySelector('.celsius-btn');
const fahrenheitBtn = document.querySelector('.fahrenheit-btn');
let isCelsius = true;
let timeInterval;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (search.value.length == 0) {
        alert('Please type the location...');
    } else {
        fetchWeatherData(search.value);
        search.value = "";
    }
});

function toggleTemperatureUnit(unit) {
    if (unit === 'celsius' && !isCelsius) {
        isCelsius = true;
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
        displayTemperatureCelsius();
    } else if (unit === 'fahrenheit' && isCelsius) {
        isCelsius = false;
        fahrenheitBtn.classList.add('active');
        celsiusBtn.classList.remove('active');
        displayTemperatureFahrenheit();
    }
}

function displayTemperatureCelsius() {
    const temperatureCelsius = (parseFloat(temp.innerHTML) - 32) * (5 / 9);
    temp.innerHTML = temperatureCelsius.toFixed(2) + "&#176C";
}

function displayTemperatureFahrenheit() {
    const temperatureFahrenheit = (parseFloat(temp.innerHTML) * (9 / 5)) + 32;
    temp.innerHTML = temperatureFahrenheit.toFixed(2) + "&#176F";
}

function fetchWeatherData(cityInput) {
    fetch(`${apiUrl}${cityInput}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const temperatureCelsius = (data.main.temp - 273.15).toFixed(2);
            temp.innerHTML = temperatureCelsius + "&#176C";
            todayCondition.innerHTML = data.weather[0].main;
            const date = new Date(data.dt * 1000); //? Convert UNIX timestamp to milliseconds
            const day = date.toLocaleDateString();
            todayDate.innerHTML = day;
            nameOutput.innerHTML = data.name;
            const iconId = data.weather[0].icon;
            icon.src = `http://openweathermap.org/img/wn/${iconId}.png`;

            if (cloudy) {
                cloudy.textContent = `${data.clouds.all}%`;
            }
            if (humidity) {
                humidity.textContent = `${data.main.humidity}%`;
            }
            if (wind) {
                wind.textContent = `${data.wind.speed} m/s`; 
            }
            if (pressure) {
                pressure.textContent = `${data.main.pressure} hPa`;
            }

            //? Clear the previous interval if it exists
            if (timeInterval) clearInterval(timeInterval);

            //? Calculate and update the local time based on timezone offset
            const timezoneOffset = data.timezone * 1000;

            function updateLocalTime() {
                const utcDate = new Date();
                const localTime = new Date(utcDate.getTime() + timezoneOffset + utcDate.getTimezoneOffset() * 60000);
                todayTime.innerHTML = localTime.toLocaleTimeString();
            }

            //? Update the local time immediately and then every second
            updateLocalTime();
            timeInterval = setInterval(updateLocalTime, 1000);

            let backgroundImage = '';
            const code = data.weather[0].id;
            if (code >= 801 && code <= 804) {
                backgroundImage = 'url(./cloudy.jpg)';
            } else if (code === 800) {
                backgroundImage = 'url(./clear.jpg)';
            } else if (code >= 600 && code <= 622) {
                backgroundImage = 'url(./snowy.jpg)';
            } else if (code >= 500 && code <= 531) {
                backgroundImage = 'url(./rainy.jpg)';
            } else if (code >= 300 && code <= 321) {
                backgroundImage = 'url(./drizzle.jpg)';
            } else if (code >= 200 && code <= 232) {
                backgroundImage = 'url(./thunderstorm.jpg)';
            } else if (code >= 701 && code <= 781) {
                backgroundImage = 'url(./mist.jpg)';
            } else {
                backgroundImage = 'default.jpg'; 
            }

            container.style.backgroundImage = backgroundImage;
            app.style.opacity = "1";
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert('City not found, please try again');
            app.style.opacity = "1";
        });
}
