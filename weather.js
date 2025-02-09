let lat, long;
const apiKey = "d2900a8f17e5de369ee56a098ffaf8be";

function startApp() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      getWeatherData();
      getForecast();
    });
  } else {
    console.log("Geolocation is not supported.");
  }

  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
}

function getWeatherData() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(
        "city"
      ).innerText = `${data.name}, ${data.sys.country}`;
      document.getElementById("temp").innerText = `${data.main.temp}°C`;
      document.getElementById("description").innerText =
        data.weather[0].description;
      document.getElementById("humidity").innerText = `${data.main.humidity}%`;
      document.getElementById("windSpeed").innerText = `${data.wind.speed} m/s`;
      document.getElementById(
        "pressure"
      ).innerText = `${data.main.pressure} hPa`;
      document.getElementById(
        "icon"
      ).src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    });
}

function getForecast() {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
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
    });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
}
