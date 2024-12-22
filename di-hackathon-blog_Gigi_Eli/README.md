# di-hackathon-blog
A full stack blog application for our December 2024 hackathon.

## Table of Contents
- [di-hackathon-blog](#di-hackathon-blog)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Environment Variables](#environment-variables)

## Introduction
The di-hackathon-blog is a full stack web application developed for the December 2024 hackathon. It allows users to create and read blog posts with a clean frontend that interacts with our backend and database. The application is built using Node.js, Express, Knex.js and EJS on the backend, and it serves static files from the `public` directory.

## Features
- Create new blog posts
- Read through existing posts
- Dynamic individual post page for each post there is
- Serve static files from the `public` directory
- Secure database connection using SSL
- Environment variable configuration

## Technologies Used
- Node.js
- Express
- PostgreSQL
- Knex.js
- dotenv
- cors
- EJS

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/theLadEli/di-hackathon-blog.git
    cd di-hackathon-blog
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up the environment variables:
    Create a [.env](http://_vscodecontentref_/0) file in the root directory and add the following:
    ```properties
    PGHOST='your_postgres_host'
    PGDATABASE='your_database_name'
    PGUSER='your_database_user'
    PGPASSWORD='your_database_password'
    ```

4. Run the application:
    ```bash
    npm start
    ```

## Usage
Once the application is running, you can access it at `http://localhost:3105`. The application serves static files from the`public` directory and provides API endpoints for interacting with the blog posts.

## API Endpoints
- `GET /post/:id`: Fetch a specific post by ID
- `GET /blogs`: Fetch all blog posts

## Environment Variables
The application uses the following environment variables:
- `PGHOST`: The hostname of the PostgreSQL server
- `PGDATABASE`: The name of the PostgreSQL database
- `PGUSER`: The PostgreSQL user
- `PGPASSWORD`: The password for the PostgreSQL user