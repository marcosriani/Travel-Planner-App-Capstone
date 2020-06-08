function handleSubmit(event) {
  event.preventDefault();

  // Hide instructions paragraphs and result title
  const instructions = document.querySelector('.description');
  const buttonShowInstructions = document.querySelector('.button');
  const resultTitle = document.querySelector('.result-title');
  const containerDiv = document.querySelector('#result');

  instructions.style.display = 'none';
  resultTitle.style.display = 'block';

  instructions.style.display === 'none'
    ? (buttonShowInstructions.style.display = 'block')
    : null;

  //  text was put into the form field
  const formField = document.getElementById('name');
  let formText = formField.value;

  // Execute button clicked function
  Client.validatorAndButton(formText, resultTitle, containerDiv);

  // GeoNames Web Services
  const baseURLGeoNames = 'http://api.geonames.org/searchJSON?q=';
  const userName = process.env.KEY1;

  // Query data GeoNames - GET request
  const getGeoName = async (baseURL, cityName) => {
    const urlToFetch = `${baseURL}${encodeURIComponent(
      cityName
    )}&maxRows=1&username=${userName}`;

    const response = await fetch(urlToFetch);

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
      console.log(data);
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

  // Post data returned from API to a database variable in server.js
  const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    try {
      const newData = await response.json();
      return newData;
    } catch (error) {
      console.log('error', error);
    }
  };

  // Query all data from database - GET request
  const getAllData = async () => {
    const response = await fetch('http://localhost:3000/allData');

    try {
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error here: ', error);
    }
  };

  // Using GET to request data from the GeoName servers
  getGeoName(baseURLGeoNames, formText).then((geoData) => {
    // Posting geo data to database
    postData('http://localhost:3000/geoPost', geoData).then(() => {
      // Getting the data back from the database
      getAllData().then((data) => {
        // Return always the latest data
        const lat = data.geoData[data.geoData.length - 1].latitude;
        const lng = data.geoData[data.geoData.length - 1].longitude;

        // Using get request to request data from the Weatherbit servers
        getWeatherbit(baseURLWeatherbit, lat, lng).then((data) => {
          //Posting weather the data to database
          postData('http://localhost:3000/weatherPost', data).then((data) => {
            // To return always the latest data
            const latestData = data.weatherData[data.weatherData.length - 1];

            // Using get request to request (Images) data from the Pixabay servers
            getPixabay(baseURLPixabay, `${formText} city`).then((data) => {
              //Posting image data to database
              postData('http://localhost:3000/imagesPost', data).then(
                (data) => {
                  // Return always the latest image
                  const latestImageData =
                    data.pixabayImages[data.pixabayImages.length - 1];
                }
              );
            });
          });
        });
      });
    });
  });
}

export { handleSubmit };
