const form = document.querySelector("#weather-form");

//weather display box details
const location = document.querySelector(".location");
const description = document.querySelector(".description");
const icon = document.querySelector(".icon");
const temp = document.querySelector(".temp");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleWeather();
});

async function fetchWeather() {
  const locationField = document.querySelector("#weather-loc-field");
  const location = locationField.value;
  const errorMsg = document.querySelector(".error-msg");
  locationField.value = "";
  errorMsg.textContent = "";

  if (!location) {
    errorMsg.textContent = "Please enter a location";
    return;
  }

  const encodedLocation = encodeURIComponent(location);

  try {
    const response = await fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
        encodedLocation +
        "?unitGroup=metric&key=X5PG92664V3LKXCPNU46SF6L5&contentType=json",
    );
    const weatherData = await response.json();

    if (!weatherData.currentConditions) {
      throw new Error("No current conditions returned from API");
    }

    const currentWeather = {
      location: capitalizeWords(weatherData.resolvedAddress),
      description: weatherData.currentConditions.conditions,
      icon: weatherData.currentConditions.icon, //snow, rain, fog ,wind, cloudy, partly-cloudy-day, partly-cloudy-night, clear-day, clear-night
      temp: weatherData.currentConditions.temp + "\u00B0C",
      feelslike: weatherData.currentConditions.feelslike + "\u00B0C",
      rainchance: weatherData.currentConditions.precipprob + "%",
      humidity: weatherData.currentConditions.humidity + "%",
    };

    console.log(currentWeather);
    return currentWeather;
  } catch (err) {
    console.log("error", err);
    errorMsg.textContent = "Please enter a valid location";
    return null;
  }
}

function renderWeather(weather) {
  location.textContent = weather.location;
  description.textContent = weather.description;
  icon.textContent = weather.icon;
  temp.textContent = weather.temp;
}

async function handleWeather() {
  clearDisplayBox();
  const weatherDetails = await fetchWeather();
  if (weatherDetails) {
    renderWeather(weatherDetails);
  }
}

function clearDisplayBox() {
  location.textContent = "";
  description.textContent = "";
  icon.innerHTML = "";
  temp.textContent = "";
}

function capitalizeWords(str) {
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
