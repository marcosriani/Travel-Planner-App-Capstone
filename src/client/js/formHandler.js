function handleSubmit(event) {
  event.preventDefault();

  // Hide instructions paragraphs and result title
  const instructions = document.querySelector('.description');
  const buttonShowInstructions = document.querySelector('.button');
  const containerDiv = document.querySelector('.tripResult');

  instructions.style.display = 'none';

  instructions.style.display === 'none'
    ? (buttonShowInstructions.style.display = 'block')
    : null;

  //  text was put into the form field
  const formField = document.getElementById('name');
  const formText = formField.value;
  let formtTextObj = { textInput: formField.value };

  // data input from the data field
  const dataField = document.getElementById('tripDate');
  console.log(dataField.value);

  // Execute button clicked function
  Client.validatorAndButton(formText);

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

      const cityTrip = latestGeoData.city;
      const countryTrip = latestGeoData.countryCode;
      const date = latestWeatherData.weatherPerDay[0].dateTime;
      const howFar = '20';
      const tripWeatherMax = latestWeatherData.weatherPerDay[0].appMaxTemp;
      const tripWeatherMin = latestWeatherData.weatherPerDay[0].appMinTemp;
      const tripWeatherDescription =
        latestWeatherData.weatherPerDay[0].weatherDescription;
      const imageTrip = latestImageData.imageURL;

      cleanUi();
      updateUI(
        imageTrip,
        cityTrip,
        countryTrip,
        date,
        howFar,
        tripWeatherMax,
        tripWeatherMin,
        tripWeatherDescription
      );

      console.log(data);
    });
  });

  // Clean UI
  const cleanUi = () => {
    // Wrapper div
    formField.value = '';
    const tripDiv = document.querySelector('#trip');
    tripDiv.innerHTML = '';
  };

  // Update UI
  const element = () => {
    return {
      div: document.createElement('div'),
      span: document.createElement('span'),
      p: document.createElement('p'),
      h1: document.createElement('h1'),
      h2: document.createElement('h2'),
      img: document.createElement('img'),
      button: document.createElement('button'),
    };
  };

  const updateUI = (
    imageUrl,
    cityName,
    countryCode,
    departingDate,
    daysFromNow,
    weatherMax,
    weatherMin,
    weatherDescription
  ) => {
    // Wrapper div
    const tripDiv = document.querySelector('#trip');
    const wrapperDiv1 = element().div;
    const wrapperDiv2 = element().div;

    wrapperDiv1.classList = 'wrapperDiv1';
    wrapperDiv2.classList = 'wrapperDiv2';

    tripDiv.appendChild(wrapperDiv1);
    tripDiv.appendChild(wrapperDiv2);

    // Creating elements and appending content
    // Image Div
    const imageDiv = element().div;
    const imageElement = element().img;

    imageDiv.classList = 'imageDiv';

    imageElement.setAttribute('src', imageUrl);

    imageDiv.appendChild(imageElement);
    wrapperDiv1.appendChild(imageDiv);

    // Title
    const h1Div = element().div;
    const h1Span1 = element().span;
    const h1Span2 = element().span;
    const h1 = element().h1;

    h1Div.classList = 'h1Div';

    h1Span1.innerHTML = 'My trip to: ';
    h1.innerHTML = cityName;
    h1Span2.innerHTML = `, ${countryCode}`;

    h1Div.appendChild(h1Span1);
    h1Div.appendChild(h1);
    h1.appendChild(h1Span2);

    wrapperDiv2.appendChild(h1Div);

    // Departing
    const departingDiv = element().div;
    const departingSpan = element().span;
    const departingDateSpan = element().span;
    const departingDateP = element().p;

    departingDiv.classList = 'departingDiv';
    departingSpan.classList = 'departingSpan';
    departingDateSpan.classList = 'departingDateSpan';

    departingSpan.innerHTML = 'Departing: ';
    departingDateSpan.innerText = departingDate;

    departingDateP.appendChild(departingSpan);
    departingDateP.appendChild(departingDateSpan);
    departingDiv.appendChild(departingDateP);
    wrapperDiv2.appendChild(departingDiv);

    // Trip is days from now
    const daysFromNowDiv = element().div;
    const h2 = element().h2;
    const daysFromNowSpan1 = element().span;
    const daysFromNowSpan2 = element().span;

    daysFromNowDiv.classList = 'daysFromNowDiv';
    daysFromNowSpan1.classList = 'numberOfDays';
    daysFromNowSpan2.classList = 'endOfh2';

    h2.innerHTML = `${cityName} is`;
    daysFromNowSpan1.innerHTML = daysFromNow;
    daysFromNowSpan2.innerHTML = 'days away.';

    daysFromNowDiv.appendChild(h2);
    daysFromNowDiv.appendChild(daysFromNowSpan1);
    daysFromNowDiv.appendChild(daysFromNowSpan2);
    wrapperDiv2.appendChild(daysFromNowDiv);

    // Weather for then
    const weatherThere = element().div;
    const weatherThereP1 = element().p;
    const weatherThereP2 = element().p;
    const weatherThereSpan1 = element().span;
    const weatherThereSpan2 = element().span;
    const weatherThereP3 = element().p;

    weatherThere.classList = 'weatherThere';
    weatherThereP1.classList = 'weatherThereP1';
    weatherThereP2.classList = 'weatherThereP2';
    weatherThereP3.classList = 'weatherThereP3';

    weatherThereP1.innerHTML = 'Typical weather for then is:';
    weatherThereSpan1.innerHTML = `Max temp: ${weatherMax}°C - `;
    weatherThereSpan2.innerHTML = `Min temp: ${weatherMin}°C`;
    weatherThereP3.innerHTML = weatherDescription;

    weatherThere.appendChild(weatherThereP1);
    weatherThereP2.appendChild(weatherThereSpan1);
    weatherThereP2.appendChild(weatherThereSpan2);
    weatherThere.appendChild(weatherThereP2);
    weatherThere.appendChild(weatherThereP3);
    wrapperDiv2.appendChild(weatherThere);

    // Make container visable
    containerDiv.style.display = 'block';
  };
}

export { handleSubmit };
