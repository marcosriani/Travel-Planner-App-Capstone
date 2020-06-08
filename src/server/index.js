// dotenv - loads environment variables from a .env file
const dotenv = require('dotenv');
dotenv.config();

// envVariable = {
//   username: process.env.KEY1,
//   weaterkey: process.env.KEY2,
//   pixalkey: process.env.KEY3,
// };

// Require Express to run server and routes, and other dependencies
const express = require('express');
var path = require('path');

// const dataAPIResponse = require('./myData.js');
const bodyParser = require('body-parser');
const cors = require('cors');

// Require the Aylien npm package
const AYLIENTextAPI = require('aylien_textapi');

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
const projectData = { geoData: [], weatherData: [], pixabayImages: [] };

// set API credentias
const textapi = new AYLIENTextAPI({
  application_id: process.env.API_ID,
  application_key: process.env.API_KEY,
});

/* Routers*/
app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
  res.send(projectData);
});

// Post router
app.post('/geoPost', (req, res) => {
  const {
    toponymName,
    lat,
    lng,
    countryName,
    population,
    countryCode,
  } = req.body.geonames[0];
  let geoNames = {};

  geoNames.city = toponymName;
  geoNames.latitude = lat;
  geoNames.longitude = lng;
  geoNames.country = countryName;
  geoNames.population = population;
  geoNames.countryCode = countryCode;

  // pushing data to the database variable
  projectData.geoData.push(geoNames);
  res.send(projectData);
});

app.post('/weatherPost', (req, res) => {
  const { country_code, timezone } = req.body;
  const daysWeather = [];

  req.body.data.forEach((dayWeather) => {
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

  weatherData.timezone = timezone;
  weatherData.weatherPerDay = daysWeather;

  // pushing data to the database variable
  projectData.weatherData.push(weatherData);
  res.send(projectData);
});

app.post('/imagesPost', (req, res) => {
  const { largeImageURL } = req.body.hits[0];

  let imageData = {};

  imageData.imageURL = largeImageURL;

  // pushing data to the database variable
  projectData.pixabayImages.push(imageData);
  res.send(projectData);

  console.log(projectData);
});

// GET route that request all data from the database
app.get('/allData', (req, res) => {
  res.send(projectData);
});

// Designates what port the app will listen to for incoming requests
const port = 3000;

app.listen(port, () => {
  console.log(`'App running on port ${port}`);
});
