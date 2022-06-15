import React, { useState, useEffect } from "react";
import axios from "axios";
import { AxiosResponse } from "axios";

interface Country {
  name: { common: string };
  capital: string;
  languages: { [key: string]: string };
  flag: string;
  area: number;
}

interface Weather {
  temp: number;
  weatherDescription: string;
  windSpeed: number;
}

const FullCountryInfo: React.FC<{ country: Country }> = ({ country }) => {
  const [show, setShow] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState<Weather | undefined>();

  useEffect(() => {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital}&appid=${process.env.REACT_APP_API_KEY}`
      )
      .then((data) =>
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${data.data[0].lat}&lon=${data.data[0].lon}&appid=${process.env.REACT_APP_API_KEY}`
          )
          .then((data) =>
            setWeatherInfo({
              temp: data.data.main.temp,
              weatherDescription: data.data.weather[0].main,
              windSpeed: data.data.wind.speed,
            })
          )
      );
  }, []);

  return (
    <div>
      <h2>
        {country.name.common} {country.flag}
      </h2>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {Object.keys(country.languages).map((key) => (
          <li key={key}>{country.languages[key]}</li>
        ))}
      </ul>
      {weatherInfo && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>
            temperature {Math.round((weatherInfo.temp - 273.15) * 10) / 10}{" "}
            Celcius
          </p>
          <p>{weatherInfo.weatherDescription}</p>
          <p>wind {weatherInfo.windSpeed} m/s</p>
        </div>
      )}
    </div>
  );
};
const CountryListItem: React.FC<{ country: Country }> = ({ country }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <span>{country.name.common}</span>
      <button onClick={() => setShow(!show)}>
        {show ? "hide info" : "show info"}
      </button>
      {show && <FullCountryInfo country={country} />}
    </div>
  );
};

const CountryList: React.FC<{ countries: Country[] }> = ({ countries }) => {
  return (
    <div>
      {countries.map((country) => (
        <CountryListItem key={country.name.common} country={country} />
      ))}
    </div>
  );
};

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const renderContent = () => {
    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredCountries.length > 10) {
      return <div>Too many matches. Make your search more specific.</div>;
    } else if (filteredCountries.length === 1) {
      return <FullCountryInfo country={filteredCountries[0]} />;
    } else {
      return <CountryList countries={filteredCountries} />;
    }
  };

  return (
    <div>
      find countries
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm.length > 0 && renderContent()}
    </div>
  );
}

export default App;
