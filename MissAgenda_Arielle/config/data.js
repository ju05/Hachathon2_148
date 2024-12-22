const knex = require("knex");
require("dotenv").config();

// Do not expose your Neon credentials to the browser

const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

const db = knex({
  client: "pg",
  connection: {
    host: PGHOST,
    port: PGPORT,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    ssl: { rejectUnauthorized: false },
  },
});


module.exports = {
  db
};

async function getVersion() {
    const result = await db.raw(`select version()`)
    console.log(result.rows);
    
}
getVersion();


