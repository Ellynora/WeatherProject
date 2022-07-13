function clock() {
  let time = new Date(),
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    day = days[time.getDay()],
    hours = time.getHours(),
    minutes = time.getMinutes(),
    seconds = time.getSeconds();

  document.querySelectorAll("#clock")[0].innerHTML =
    harold(day) +
    " " +
    harold(hours) +
    ":" +
    harold(minutes) +
    ":" +
    harold(seconds);

  function harold(standIn) {
    if (standIn < 10) {
      standIn = "0" + standIn;
    }
    return standIn;
  }
}
setInterval(clock, 1000);

// const axios = require("axios").default;
const searchInput = document.querySelector("#search-text-input"),
      currentCity = document.querySelector("#city"),
      form = document.querySelector("form"),
      temperatureElement = document.querySelector("#temperature"),
      country = document.querySelector("#country"),
      main = document.querySelector("#main"),
      wind = document.querySelector("#wind"),
      humidity = document.querySelector("#humidity"),
      icon = document.querySelector("#icon"),
      feelsLike = document.querySelector("#feelsLike");

      
function convertToFahrenheit(e) {
  e.preventDefault();
  let fahrenheiTemp = Math.round((celsiusTemp * 9) / 5 + 32);
  temperatureElement.innerHTML = fahrenheiTemp;
}
function convertToCelsius(e) {
  e.preventDefault();
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#farenheit-temp");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsium-temp");
celsiusLink.addEventListener("click", convertToCelsius);

function showTemperature(response) {
  country.innerHTML = response.data.sys.country;
  celsiusTemp = `${Math.round(response.data.main.temp)}`;
  temperatureElement.innerHTML = celsiusTemp;
  currentCity.innerHTML = `${response.data.name}`;
  humidity.innerHTML = `Humidity: ${response.data.main.humidity} %`;
  wind.innerHTML = `Wind: ${response.data.wind.speed} km/h `;
  feelsLike.innerHTML = `Feels like: ${Math.round(response.data.main.feels_like)} °C`;
  main.innerHTML = response.data.weather[0].description;
  icon.setAttribute("src", `img/openweathermap/${response.data.weather[0].icon}.svg `);
  getForecast(response.data.coord);
  console.log(response);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000),
      day = date.getDay();
      days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
    forecastHTML = forecastHTML +
      `
      <div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
      <img
        src="img/openweathermap/${
          forecastDay.weather[0].icon
        }.svg"
        alt=""
        width="50"
      />
      <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max"> ${Math.round(
          forecastDay.temp.max
        )}° </span>
        <span class="weather-forecast-temperature-min"> ${Math.round(
          forecastDay.temp.min
        )}° </span>
      </div>
    </div>
  `;
        }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}


function getForecast(coordinates) {
  let apiKey = "3aa8ed31378614c2734915cb4e9d353f";
  let apiUrl2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl2).then(displayForecast);
}

function showPosition(position) {
  let apiKey = "3aa8ed31378614c2734915cb4e9d353f",
      units = "metric",
      latitude = position.coords.latitude,
      longitude = position.coords.longitude,
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}
let navi = (e) => {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
};

let currentCityPosition = document.querySelector("#curLocBtn");
currentCityPosition.addEventListener("click", navi);

let search = (e) => {
  e.preventDefault();
  weatherUpdate(searchInput.value);
  searchInput.value = " ";
};
form.addEventListener("submit", search);

weatherUpdate = (city) => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=3aa8ed31378614c2734915cb4e9d353f`
  );
  xhr.send();
  xhr.onload = () =>{
    if (xhr.status=== 404) {
      alert("Place not found")
    } else {
      let data = JSON.parse(xhr.response);
      currentCity.innerHTML = data.name;
      country.innerHTML = data.sys.country;
      humidity.innerHTML = `Humidity: ${data.main.humidity} %`;
      wind.innerHTML = `WInd: ${data.wind.speed} km/h `;
      feelsLike.innerHTML = `Feels like: ${Math.round(data.main.feels_like)} °C`;
      celsiusTemp = `${Math.round(data.main.temp)}`;
      temperatureElement.innerHTML = celsiusTemp;
      main.innerHTML = data.weather[0].description;
      icon.setAttribute("src", `img/openweathermap/${data.weather[0].icon}.svg `);
      getForecast(data.coord);
      console.log(data);
    };
  };
};
weatherUpdate("Kyiv");
