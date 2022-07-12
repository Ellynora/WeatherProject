function clock() {
  let time = new Date(),
    days = ["Sun", "Mon", "Tue", "Wed", "Thue", "Fri", "Sat"],
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
      // weatherBlock = document.querySelector("#weather"),
      country = document.querySelector("#country"),
      main = document.querySelector("#main"),
      wind = document.querySelector("#wind"),
      humidity = document.querySelector("#humidity"),
      icon = document.querySelector("#icon"),
      feelsLike = document.querySelector("#feelsLike");

let convertToFahrenheit = (e) => {
  e.preventDefault();
  temperatureElement.innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
};
let convertToCelsius = (e) => {
  e.preventDefault();
  temperatureElement.innerHTML = Math.round(celsiusTemp);
};

let celsiusTemp = null;

let fahrenheitLink = document.querySelector("#farenheit-temp");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsium-temp");
celsiusLink.addEventListener("click", convertToCelsius);

function showTemperature(response) {
    country.innerHTML = response.data.sys.country,
    temperatureElement.innerHTML = `${Math.round(response.data.main.temp)}`,
    currentCity.innerHTML = `${response.data.name}`;
    humidity.innerHTML = `Humidity: ${response.data.main.humidity} %`;
    wind.innerHTML = `Wind: ${response.data.wind.speed} km/h `;
    feelsLike.innerHTML = `Feels like: ${Math.round(response.data.main.feels_like)} °C`;
    main.innerHTML = response.data.weather[0].description;
    icon.setAttribute("src", `img/openweathermap/${response.data.weather[0].icon}.svg `);
    console.log(response);
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
      temperatureElement.innerHTML = `${Math.round(data.main.temp)}`;
      main.innerHTML = data.weather[0].description;
      icon.setAttribute("src", `img/openweathermap/${data.weather[0].icon}.svg `);
      console.log(data);
    };
  };
};
weatherUpdate("Kyiv");