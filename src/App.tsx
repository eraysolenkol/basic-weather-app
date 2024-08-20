import { useEffect, useState } from "react";
import "./App.css";

interface WeatherData {
  current: {
    temperature_2m: number;
    is_day: number;
    relative_humidity_2m: number;
    time: string;
    weather_code: number;
    wind_speed_10m: number;
  };
}

function App() {
  const [input, setInput] = useState("");
  const [city, setCity] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const imagesForType: { [key: number]: string } = {
    0: "sunny",
    1: "sunny",
    2: "part_cloudy",
    3: "part_cloudy",
    45: "fog",
    48: "fog",
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    56: "freezing_drizzle",
    57: "freezing_drizzle",
    61: "rain",
    63: "rain",
    65: "rain",
    66: "freezing_rain",
    67: "freezing_rain",
    71: "snowflake",
    73: "snowflake",
    75: "snowflake",
    77: "snowflake",
    80: "rain_showers",
    81: "rain_showers",
    82: "rain_showers",
    85: "snow",
    86: "snow",
    95: "thunderstorm_rain",
    96: "thunderstorm_rain",
    99: "thunderstorm_rain",
  };

  const [weather, setWeather] = useState<WeatherData | null>(null);

  const handleClick = async () => {
    if (!input) {
      return;
    }

    let res = await fetch(
      `${import.meta.env.VITE_GEOCODING_API_URL}?q=${input}&api_key=${
        import.meta.env.VITE_GEOCODING_API_KEY
      }`
    );
    let data = await res.json();
    let cityData: any = data[0];
    if (!cityData) {
      return;
    }
    setCity(cityData.display_name);
    let resWeather = await fetch(
      `${import.meta.env.VITE_WEATHER_API_URL}?latitude=${
        cityData.lat
      }&longitude=${
        cityData.lon
      }&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m`
    );
    let dataWeather = await resWeather.json();
    setIsUpdated(true);
    console.log(dataWeather);

    setWeather(dataWeather);
  };
  const weatherImage = weather?.current
    ? `/public/weather_set/${imagesForType[weather.current.weather_code]}.png`
    : "";
  useEffect(() => {
    if (isUpdated) {
      const timeout = setTimeout(() => setIsUpdated(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isUpdated]);

  return (
    <>
      <div className="container">
        <h1>Weather Forecast</h1>
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="City name"
          style={{ width: "400px", marginBottom: "20px" }}
          onChange={(e) => setInput(e.target.value)}
        />

        <input
          type="button"
          value="Search"
          className="btn btn-outline-secondary"
          onClick={handleClick}
          style={{ width: "300px", marginBottom: "50px" }}
        />
        {!city && (
          <>
            <h2>Please enter a city to search</h2>
            <h4 style={{ color: "gray" }}>
              (You can enter the city name with country name)
            </h4>
          </>
        )}
        {city && <h1 className={isUpdated ? "updated" : ""}>{city}</h1>}
        {weather && (
          <>
            <div className="info">
              <img src={weatherImage} alt="" width="120px" height="120px" />
              <h2
                className={isUpdated ? "updated" : ""}
                style={{ textAlign: "center" }}
              >
                {weather && weather.current.temperature_2m.toFixed(0)} °C
              </h2>
            </div>
            <div className="info">
              <img
                src="/public/weather_set/humidity.png"
                alt=""
                width="120px"
                height="120px"
              />
              <h2 className={isUpdated ? "updated" : ""}>
                {weather && weather.current.relative_humidity_2m}%
              </h2>
            </div>
            <div className="info">
              <img
                src="/public/weather_set/wind.png"
                alt=""
                width="100px"
                height="100px"
                style={{ marginLeft: "80px" }}
              />
              <h2 className={isUpdated ? "updated" : ""}>
                {weather && weather.current.wind_speed_10m} km/h
              </h2>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
