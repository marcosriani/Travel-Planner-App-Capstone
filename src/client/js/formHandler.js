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
  const formText = formField.value;
  let formtTextObj = { textInput: formField.value };

  // Execute button clicked function
  Client.validatorAndButton(formText, resultTitle, containerDiv);

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

  // Posting input text into server so that it's used as a query term in the APIs
  postData('http://localhost:3000/query', formtTextObj).then((data) => {
    getAllData().then((data) => {
      // To return always the latest data
      const latestGeoData = data.geoData[data.geoData.length - 1];
      const latestWeatherData = data.weatherData[data.weatherData.length - 1];
      const latestImageData = data.pixabayImages[data.pixabayImages.length - 1];

      console.log(latestGeoData);
      console.log(latestWeatherData);
      console.log(latestImageData);
      console.log(data);
    });
  });
}

export { handleSubmit };
