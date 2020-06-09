# Project Instructions

This project was build with Webpack, Sass, Service workers, an external API, express and node.js.

The goal of this project was to have practice with:

- Setting up Webpack
- Sass styles
- Webpack Loaders and Plugins
- Creating layouts and page design
- Service workers
- Using APIs and creating requests to external urls

APIs used
Geonames - Used to get geolocation data
Weatherbit - Used to get weather data
Pixabay - Used to get image data
Restcountries - Used to get country data

## Getting started

Clone or fork the project, you will still need to install everything:

`cd` into your new folder and run:

- `npm install`

## Dependencies

    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "node-fetch": "^2.6.0",
    "regenerator-runtime": "^0.13.5",
    "supertest": "^4.0.2",
    "webpack-cli": "^3.3.11"

## Setting up the API

You need credencial of the geonames, weatherbit, and pixabay API to validade your requests.

http://www.geonames.org/export/web-services.html
https://www.weatherbit.io/account/create
https://pixabay.com/api/docs/
https://restcountries.eu/

### Step 4: Environment Variables

Next we need to declare our API keys, which will look something like this:

```
// set APIs credentias
var textapi = new APINAME({
  application_id: "your-api-id",
  application_key: "your-key"
});
```

Use NPM to run the project in Dev mode with the command npm run build-dev, or in production mode with npm build-prod.
