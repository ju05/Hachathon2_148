require('dotenv').config();
const express = require('express');
const axios = require('axios');
const knex = require('knex')(require('./knexfile'));  // Knex config
const app = express();
const path = require('path');

// Middleware
app.use(express.static('public'));
app.use(express.json());

// To get weather data for a city
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY;  // Use API key from .env file
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).send("Error fetching weather data");
  }
});

// To add a city to favorites
app.post('/favorites', (req, res) => {
  const { userId, cityName } = req.body;
  knex('favorites')
    .insert({ userId, cityName })
    .then(() => res.status(201).json({ message: 'City added to favorites' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// To get user's favorite cities
app.get('/favorites', (req, res) => {
  const userId = req.query.userId;
  knex('favorites')
    .where('userId', userId)
    .then(favorites => res.json(favorites))
    .catch(err => res.status(500).json({ error: err.message }));
});

// To delete a city from favorites
app.delete('/favorites', (req, res) => {
  const { userId, cityName } = req.query;

  if (!userId || !cityName) {
    return res.status(400).json({ error: "Missing userId or cityName" });
  }

  knex('favorites')
    .where({ userId, cityName })
    .del()
    .then((rowsDeleted) => {
      if (rowsDeleted > 0) {
        res.status(200).json({ message: `${cityName} has been removed from your favorites.` });
      } else {
        res.status(404).json({ error: `${cityName} not found in favorites.` });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the city' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
