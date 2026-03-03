const form = document.querySelector("#weather-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchWeather();
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
      location: weatherData.resolvedAddress,
      description: weatherData.currentConditions.conditions,
      icon: weatherData.currentConditions.icon, //snow, rain, fog ,wind, cloudy, partly-cloudy-day, partly-cloudy-night, clear-day, clear-night
      temp: weatherData.currentConditions.temp,
      feelslike: weatherData.currentConditions.feelslike,
      rainchance: weatherData.currentConditions.precipprob,
      humidity: weatherData.currentConditions.humidity,
    };
    console.log(currentWeather);
    return currentWeather;
  } catch (err) {
    console.log("error", err);
    return null;
  }
}
