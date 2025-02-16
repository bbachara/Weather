let lat, long;
const apiKey = "d2900a8f17e5de369ee56a098ffaf8be";

function startApp() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        getWeatherData(lat, long);
        getForecast(lat, long);
      },
      (error) => {
        console.log(
          "Geolocation permission denied. Please enter a location manually."
        );
      }
    );
  }

  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
}

function getWeatherData(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data, lat, lon);
    })
    .catch((error) => console.log("Error fetching weather data:", error));
}

function getForecast(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => console.log("Error fetching forecast:", error));
}

function searchWeather() {
  let location = document.getElementById("locationInput").value;
  if (!location) return;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod !== 200) {
        alert("Location not found. Please enter a valid city name.");
        return;
      }
      let lat = data.coord.lat;
      let lon = data.coord.lon;
      displayWeather(data, lat, lon);
      getForecastByCity(location);
    })
    .catch((error) => console.log("Error fetching weather data:", error));
}

function getForecastByCity(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => console.log("Error fetching forecast:", error));
}

function displayWeather(data, lat, lon) {
  document.getElementById(
    "city"
  ).innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById("city").setAttribute("data-lat", lat);
  document.getElementById("city").setAttribute("data-lon", lon);
  document.getElementById("temp").innerText = `${data.main.temp}°C`;
  document.getElementById("description").innerText =
    data.weather[0].description;
  document.getElementById("humidity").innerText = `${data.main.humidity}%`;
  document.getElementById("windSpeed").innerText = `${data.wind.speed} m/s`;
  document.getElementById("pressure").innerText = `${data.main.pressure} hPa`;
  document.getElementById(
    "icon"
  ).src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
}

function displayForecast(data) {
  let forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  let dailyData = data.list.filter((reading) =>
    reading.dt_txt.includes("12:00:00")
  );
  dailyData.forEach((day) => {
    let date = new Date(day.dt * 1000).toLocaleDateString();
    let temp = day.main.temp;
    let icon = day.weather[0].icon;
    let description = day.weather[0].description;

    let forecastCard = `
      <div class="card m-2 p-3" style="width: 150px;">
        <h5>${date}</h5>
        <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather icon">
        <p>${temp}°C</p>
        <p>${description}</p>
      </div>
    `;

    forecastContainer.innerHTML += forecastCard;
  });
}

function openMap() {
  let cityElement = document.getElementById("city");
  let lat = cityElement.getAttribute("data-lat");
  let lon = cityElement.getAttribute("data-lon");

  if (lat && lon) {
    let mapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12`;
    window.open(mapUrl, "_blank");
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
}
