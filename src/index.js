import "./styles.css";

const form = document.querySelector("#weather-form");

//weather display box details
const displayBox = document.querySelector(".display");
const location = document.querySelector(".location");
const time = document.querySelector(".time");
const description = document.querySelector(".description");
const icon = document.querySelector(".icon");
const temp = document.querySelector(".temp");
const wind = document.querySelector(".wind");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleWeather();
});

async function handleWeather() {
  clearDisplayBox();
  const weatherDetails = await fetchWeather();
  if (weatherDetails) {
    renderWeather(weatherDetails);
  }
}

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
      time: convertReadableTime(weatherData.currentConditions.datetime),
      icon: weatherData.currentConditions.icon, //snow, rain, fog ,wind, cloudy, partly-cloudy-day, partly-cloudy-night, clear-day, clear-night
      temp: weatherData.currentConditions.temp + "\u00B0C",
      feelslike: weatherData.currentConditions.feelslike + "\u00B0C",
      rainchance: weatherData.currentConditions.precipprob + "%",
      humidity: weatherData.currentConditions.humidity + "%",
      wind: weatherData.currentConditions.windspeed + " m/s",
    };

    console.log(currentWeather);
    return currentWeather;
  } catch (err) {
    console.log("error", err);
    errorMsg.textContent = "Please enter a valid location";
    return null;
  }
}

async function renderWeather(weather) {
  //append to displayBox

  const loctimeDiv = createDiv("location-time"); //location and time
  const locationDiv = createDiv("location", weather.location);
  const timeDiv = createDiv("time", weather.time);

  const iconDescDiv = createDiv("icon-desc"); //details
  //different div creation for icon & description

  const iconDiv = createDiv("icon");
  const iconImg = await loadIcon(weather.icon);
  iconDiv.append(iconImg);

  const descDiv = createDiv("description", weather.description);

  const otherDetailsDiv = createDiv("other-details");
  const tempDiv = createDiv("temp", `Temperature: ${weather.temp}`);
  const windDiv = createDiv("wind", `Wind: ${weather.wind}`);

  loctimeDiv.append(locationDiv, timeDiv);
  iconDescDiv.append(iconDiv, descDiv);
  otherDetailsDiv.append(tempDiv, windDiv);

  displayBox.append(loctimeDiv, iconDescDiv, otherDetailsDiv);
}

function clearDisplayBox() {
  displayBox.innerHTML = "";
}

function capitalizeWords(str) {
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

//convert to human readable time - xx:xx AM/PM
function convertReadableTime(time) {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

//returns a Promise that resolves to an <img> element with the SVG as src
async function loadIcon(iconName) {
  const icon = await import(`./assets/${iconName}.svg`);
  const iconImg = document.createElement("img");
  iconImg.src = icon.default; // icon is a module object; .default contains the SVG file path
  iconImg.alt = iconName;
  return iconImg;
}

function createDiv(className, text) {
  const div = document.createElement("div");
  div.className = className;
  div.textContent = text || "";
  return div;
}
