Project Title: Weather Dashboard

Description:

My Weather Dashboard is a full-stack web application that allows users to check the current weather for any city and save their favorite cities. The app fetches weather data from the OpenWeatherMap API and uses PostgreSQL to store users' favorite cities. It was built using Node.js, Express, Knex, and JavaScript.

Technologies Used:

Node.js: Backend runtime environment.
Express: Web framework for routing and handling HTTP requests.
PostgreSQL: Database for storing favorite cities.
Knex.js: SQL query builder for interacting with PostgreSQL.
OpenWeatherMap API: API to fetch real-time weather data.
HTML, CSS, JavaScript: Frontend technologies used for UI/UX.

Key Features:
Weather Data Fetching: Allows users to view the current weather for any city.
Favorites Management: Users can add and view their favorite cities, which are stored in a PostgreSQL database.
Background Music Toggle: Option to toggle background music for a fun user experience.

How It Works:

Frontend: Users input a city name in the search bar, and the app fetches weather data from the OpenWeatherMap API.

Backend: The weather data is fetched through a GET request, and favorite cities are stored using a POST request in the PostgreSQL database via Knex.

Database: Cities added to the favorites list are stored in a PostgreSQL database with tables for managing users and their favorite cities.

API Routes:

GET /weather: Fetch weather data for a specific city using the OpenWeatherMap API.
POST /favorites: Add a city to the user's list of favorites.
GET /favorites: Retrieve the user's list of favorite cities from the database.

GitHub : "https://github.com/HarryLaboratory/Hackathon"