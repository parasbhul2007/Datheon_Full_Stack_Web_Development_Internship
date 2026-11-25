// Get your API key from https://openweathermap.org/api
const API_KEY = "PASTE_YOUR_NEW_API_KEY_HERE";

const $ = (selector) => document.querySelector(selector);

const form = $("#searchForm");
const input = $("#cityInput");
const statusBox = $("#status");
const loader = $("#loader");
const content = $("#weatherContent");

const iconMap = {
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Rain: "🌧️",
  Snow: "❄️",
  Mist: "🌫️",
  Smoke: "🌫️",
  Haze: "🌫️",
  Dust: "🌫️",
  Fog: "🌫️",
  Sand: "🌫️",
  Ash: "🌫️",
  Squall: "💨",
  Tornado: "🌪️",
  Clear: "☀️",
  Clouds: "☁️",
};

function showStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.classList.toggle("error", isError);
}

function setLoading(loading) {
  loader.classList.toggle("hidden", !loading);
  form.querySelector("button").disabled = loading;
}

function iconFor(main) {
  return iconMap[main] || "🌡️";
}

function weatherTheme(main, timezone) {
  const hour = new Date(Date.now() + timezone * 1000).getUTCHours();

  document.body.classList.remove(
    "weather-clear",
    "weather-rain",
    "weather-clouds",
    "weather-night",
  );

  if (["Rain", "Drizzle", "Thunderstorm"].includes(main)) {
    document.body.classList.add("weather-rain");
  } else if (main === "Clouds" || ["Mist", "Fog", "Haze"].includes(main)) {
    document.body.classList.add("weather-clouds");
  } else if (hour < 6 || hour >= 19) {
    document.body.classList.add("weather-night");
  } else {
    document.body.classList.add("weather-clear");
  }
}

function dayName(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

function groupForecast(list, timezone) {
  const groups = {};

  list.forEach((item) => {
    const localDate = new Date((item.dt + timezone) * 1000);

    const key = localDate.toISOString().slice(0, 10);

    if (!groups[key]) groups[key] = [];

    groups[key].push(item);
  });

  return Object.entries(groups)
    .slice(0, 5)
    .map(([key, items]) => {
      const temps = items.map((item) => item.main.temp);

      const midday = items.reduce(
        (best, item) =>
          Math.abs(new Date((item.dt + timezone) * 1000).getUTCHours() - 12) <
          Math.abs(new Date((best.dt + timezone) * 1000).getUTCHours() - 12)
            ? item
            : best,
        items[0],
      );

      return {
        date: new Date(key + "T12:00:00Z"),
        min: Math.round(Math.min(...temps)),
        max: Math.round(Math.max(...temps)),
        weather: midday.weather[0],
      };
    });
}

function renderForecast(days) {
  $("#forecast").innerHTML = days
    .map(
      (day, index) => `
        <article class="forecast-card">
          <div class="day">
            ${index === 0 ? "Today" : dayName(day.date)}
          </div>
          <div class="icon">
            ${iconFor(day.weather.main)}
          </div>
          <div class="desc">
            ${day.weather.description}
          </div>
          <div class="temps">
            ${day.max}°
            <span>${day.min}°</span>
          </div>
        </article>
      `,
    )
    .join("");
}

async function fetchWeather(city) {
  if (!API_KEY || API_KEY === "PASTE_YOUR_NEW_API_KEY_HERE") {
    showStatus(
      "Add your OpenWeatherMap API key in script.js before searching.",
      true,
    );
    return;
  }

  setLoading(true);
  showStatus("Searching weather data…", false);
  content.classList.add("hidden");

  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    const current = await currentResponse.json();
    const forecast = await forecastResponse.json();

    if (!currentResponse.ok || !forecastResponse.ok) {
      const message =
        current.message || forecast.message || "Unable to find this city.";

      throw new Error(
        message === "city not found"
          ? "City not found. Check the spelling and try again."
          : message,
      );
    }

    const timezone = current.timezone || 0;

    $("#cityName").textContent = `${current.name}, ${current.sys.country}`;

    $("#currentDate").textContent = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date((current.dt + timezone) * 1000));

    $("#currentIcon").textContent = iconFor(current.weather[0].main);

    $("#temperature").textContent = `${Math.round(current.main.temp)}°`;

    $("#condition").textContent = current.weather[0].description.replace(
      /\b\w/g,
      (char) => char.toUpperCase(),
    );

    $("#feelsLike").textContent = `${Math.round(current.main.feels_like)}°`;

    $("#humidity").textContent = `${current.main.humidity}%`;

    $("#wind").textContent = `${current.wind.speed} m/s`;

    $("#pressure").textContent = `${current.main.pressure} hPa`;

    $("#forecastLocation").textContent = current.name;

    renderForecast(groupForecast(forecast.list, timezone));

    weatherTheme(current.weather[0].main, timezone);

    content.classList.remove("hidden");

    showStatus(`Weather updated for ${current.name}.`);
  } catch (error) {
    showStatus(
      error.message === "Failed to fetch"
        ? "Network error. Check your internet connection and try again."
        : error.message,
      true,
    );
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const city = input.value.trim();

  if (city) {
    fetchWeather(city);
  }
});
