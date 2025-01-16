/* Global Variables */
const apiKey = 'process.env.API_KEY&units=imperial'; 
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// Select DOM elements
const generateButton = document.getElementById('generate');
const zipInput = document.getElementById('zip');
const feelingsInput = document.getElementById('feelings');
const dateElement = document.getElementById('date');
const tempElement = document.getElementById('temp');
const contentElement = document.getElementById('content');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;

// Event listener for the 'Generate' button
generateButton.addEventListener('click', () => {
  const zipCode = zipInput.value;
  const feelings = feelingsInput.value;

  if (!zipCode) {
    alert('Please enter a zip code!');
    return;
  }

  getWeatherData(baseURL, zipCode, apiKey)
    .then((data) => {
      if (data.cod !== 200) {
        alert(`Error: ${data.message}`);
        return;
      }
      // Post data to the server
      return postData('/add', {
        date: newDate,
        temp: data.main.temp,
        content: feelings,
      });
    })
    .then(() => updateUI())
    .catch((error) => console.error('Error:', error));
});

// Function to fetch weather data from OpenWeatherMap API
const getWeatherData = async (baseURL, zip, apiKey) => {
  const response = await fetch(`${baseURL}${zip},us&appid=${apiKey}`);
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

// Function to post data to the server
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
    console.error('Error posting data:', error);
  }
};

// Function to update the UI with the most recent entry
const updateUI = async () => {
  const request = await fetch('/all');
  try {
    const allData = await request.json();
    dateElement.innerHTML = `Date: ${allData.date}`;
    tempElement.innerHTML = `Temperature: ${Math.round(allData.temp)}°C`;
    contentElement.innerHTML = `Feeling: ${allData.content}`;
  } catch (error) {
    console.error('Error updating UI:', error);
  }
};

// Function to retrieve and log data from the server (alternative to updateUI)
const retrieveData = async () => {
  const request = await fetch('/all');
  try {
    const allData = await request.json();
    console.log(allData);

    // Update DOM elements with retrieved data
    tempElement.innerHTML = `${Math.round(allData.temp)} degrees`;
    contentElement.innerHTML = allData.feel;
    dateElement.innerHTML = allData.date;
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};

// Optional: Add an event listener to call retrieveData
document.getElementById('retrieve-data').addEventListener('click', retrieveData);
