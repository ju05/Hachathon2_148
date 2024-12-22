# Word Learning App

The web application to learn new words with cards in a sequential order.

## Features
- manage your card set;
- learning sessions to study all the cards or only the part of it.

## How to install

1. Clone the repo;
2. Run `npm install`;
3. Prepare `.env` file;

```
SECRET=mysecretword
DBUSER=dbusername
DBPASSWORD=dbpassword
DBNAME=dbname
DBPORT=dbport
```

4. Prepare the database: run `npm run reset`;
5. Run `run run.js` or `npx nodemon run.js`;
6. Open the browser and go to `localhost:5000`.

