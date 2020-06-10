// dotenv - loads environment variables from a .env file
const dotenv = require('dotenv');
dotenv.config();

// A light-weight module that brings window.fetch to Node.js
const fetch = require('node-fetch');

// Require Express to run server and routes, and other dependencies
const express = require('express');
var path = require('path');

// const dataAPIResponse = require('./myData.js');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();

/* Middleware*/
// Cross-origin resource sharing
app.use(cors());

// to use url encoded values
app.use(bodyParser.urlencoded({ extended: true }));

// to use json
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static('dist'));

// My database
const projectData = {
  geoData: [],
  weatherData: [],
  pixabayImages: [],
  countryInfo: [],
};

// GeoNames Web Services
const baseURLGeoNames = 'http://api.geonames.org/searchJSON?q=';
const userName = process.env.KEY1;

// Query data GeoNames - GET request
const getGeoName = async (baseURL, cityName) => {
  const urlToFetch = `${baseURL}${encodeURIComponent(
    cityName
  )}&maxRows=1&username=${userName}`;

  const response = await fetch(urlToFetch);
  // console.log(response);

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error here: ', error);
  }
};

// Weatherbit API
const baseURLWeatherbit = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const weatherbitIpi = process.env.KEY2;

// Query data Weatherbit - GET request
const getWeatherbit = async (baseURL, lat, lng) => {
  const urlToFetch = `${baseURL}lat=${lat}&lon=${lng}&key=${weatherbitIpi}`;

  const response = await fetch(urlToFetch);

  try {
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log('Error here: ', error);
  }
};

// Pixabay API
const baseURLPixabay = 'https://pixabay.com/api/';
const pixabayIpi = process.env.KEY3;
// Query data Weatherbit - GET request
const getPixabay = async (baseURL, searchTerm) => {
  const urlToFetch = `${baseURL}?key=${pixabayIpi}&q=${encodeURIComponent(
    searchTerm
  )}`;

  const response = await fetch(urlToFetch);

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error here: ', error);
  }
};

// REST Countries API
const baseURLRestCountries = 'https://restcountries.eu/rest/v2/name/';
// Query data Weatherbit - GET request
const getRestCountries = async (searchTerm) => {
  const urlToFetch = `${baseURLRestCountries}${searchTerm}`;

  const response = await fetch(urlToFetch);

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error here: ', error);
  }
};

/* Routers*/

// app.get('/', (req, res) => {
//   res.sendFile('dist/index.html');
//   res.send(projectData);
// });
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  // res.send(projectData);
});

// Post route that post data from the client side to server side
app.post('/query', (req, res) => {
  const query = req.body.textInput;

  // Using get request to request data from the GeoName servers
  getGeoName(baseURLGeoNames, query).then((geoData) => {
    const {
      toponymName,
      lat,
      lng,
      countryName,
      population,
      countryCode,
    } = geoData.geonames[0];
    let geoNames = {};

    geoNames.city = toponymName;
    geoNames.latitude = lat;
    geoNames.longitude = lng;
    geoNames.country = countryName;
    geoNames.population = population;
    geoNames.countryCode = countryCode;

    // pushing data to the database variable
    projectData.geoData.push(geoNames);

    // Return always the latest data
    const lastLat =
      projectData.geoData[projectData.geoData.length - 1].latitude;
    const lastLng =
      projectData.geoData[projectData.geoData.length - 1].longitude;

    // Using get request to request data from the Weatherbit servers
    getWeatherbit(baseURLWeatherbit, lastLat, lastLng).then((data) => {
      //Posting weather the data to database

      const { country_code, timezone } = data;
      const daysWeather = [];

      data.data.forEach((dayWeather) => {
        daysWeather.push({
          appMaxTemp: dayWeather.app_max_temp,
          appMinTemp: dayWeather.app_min_temp,
          dateTime: dayWeather.datetime,
          highTemp: dayWeather.high_temp,
          lowTemp: dayWeather.low_temp,
          sunriseTs: dayWeather.sunrise_ts,
          sunsetTs: dayWeather.sunset_ts,
          weatherDescription: dayWeather.weather.description,
        });
      });

      let weatherData = {};

      weatherData.countryCode = country_code;
      weatherData.timezone = timezone;
      weatherData.weatherPerDay = daysWeather;

      // pushing data to the database variable
      projectData.weatherData.push(weatherData);

      // Get the latest geo data with city name and country
      const latestGeoData = projectData.geoData[projectData.geoData.length - 1];

      // Using get request to request (Images) data from the Pixabay servers
      getPixabay(
        baseURLPixabay,
        `${latestGeoData.city} ${latestGeoData.country}`
      ).then((data) => {
        //Posting image data to database
        const { largeImageURL } = data.hits[0];

        let imageData = {};

        imageData.imageURL = largeImageURL;

        // pushing data to the database variable
        projectData.pixabayImages.push(imageData);

        getRestCountries(latestGeoData.country).then((data) => {
          const {
            name,
            callingCodes,
            capital,
            region,
            demonym,
            flag,
            languages,
            currencies,
          } = data[0];

          const countryAPIData = {};

          countryAPIData.name = name;
          countryAPIData.callingCodes = callingCodes;
          countryAPIData.capital = capital;
          countryAPIData.region = region;
          countryAPIData.demonym = demonym;
          countryAPIData.flag = flag;
          countryAPIData.languages = languages;
          countryAPIData.currencies = currencies;

          projectData.countryInfo.push(countryAPIData);

          res.send(projectData);
        });
      });
    });
  });
});

// GET route that request all data from the database
app.get('/allData', (req, res) => {
  res.send(projectData);
});

// Designates what port the app will listen to for incoming requests
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`'App running on port ${port}`);
});

module.exports = app;
