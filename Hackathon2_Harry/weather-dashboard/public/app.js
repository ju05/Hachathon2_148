document.getElementById('getWeatherBtn').addEventListener('click', getWeather);
document.getElementById('addCityBtn').addEventListener('click', addToFavorites);
document.getElementById('musicToggle').addEventListener('click', toggleMusic);

let backgroundMusic = document.getElementById('backgroundMusic');
let favoriteCities = [];

function toggleMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
}

function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (city) {
    axios.get(`/weather?city=${city}`)
      .then(response => {
        displayWeather(response.data);
      })
      .catch(err => {
        console.error(err);
        alert('Could not retrieve weather data.');
      });
  } else {
    alert('Please enter a city name.');
  }

  
  document.getElementById('weatherDisplay').style.display = 'block';
}


function displayWeather(weatherData) {
  document.getElementById('cityName').textContent = weatherData.name;

  // Emoji based on the weather
  let weatherIcon = '';
  const weatherDescription = weatherData.weather[0].description.toLowerCase();

  if (weatherDescription.includes('clear')) {
    weatherIcon = '🌞'; 
  } else if (weatherDescription.includes('rain')) {
    weatherIcon = '🌧️'; 
  } else if (weatherDescription.includes('cloud')) {
    weatherIcon = '☁️'; 
  } else if (weatherDescription.includes('snow')) {
    weatherIcon = '❄️'; 
  } else {
    weatherIcon = '🌤️'; 
  }

  document.getElementById('weatherDescription').textContent = `${weatherIcon} ${weatherData.weather[0].description}`;
  document.getElementById('temperature').textContent = `Temperature: ${weatherData.main.temp}°C`;
  document.getElementById('humidity').textContent = `Humidity: ${weatherData.main.humidity}%`;
  document.getElementById('windSpeed').textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;
}

function addToFavorites() {
  const city = document.getElementById('cityInput').value;
  if (city) {
    axios.post('/favorites', { userId: 1, cityName: city })
      .then(response => {
        alert('City added to favorites!');
        loadFavorites();
      })
      .catch(err => {
        console.error(err);
        alert('Could not add city to favorites.');
      });
  } else {
    alert('Please enter a city name to add to favorites.');
  }
}

function loadFavorites() {
  axios.get('/favorites?userId=1')
    .then(response => {
      favoriteCities = response.data;
      displayFavorites();
    })
    .catch(err => {
      console.error(err);
      alert('Could not load favorite cities.');
    });
}

function displayFavorites() {
  const favoriteCitiesList = document.getElementById('favoriteCities');
  favoriteCitiesList.innerHTML = ''; // Clear the existing list
  favoriteCities.forEach(favorite => {
    const li = document.createElement('li');
    li.textContent = favorite.cityName;


    // Click Favorites
    li.addEventListener('click', () => {
      document.getElementById('cityInput').value = favorite.cityName;
      getWeather(); 
    });

    favoriteCitiesList.appendChild(li);
  });
}

// Load favorite cities on page load
window.onload = loadFavorites;




