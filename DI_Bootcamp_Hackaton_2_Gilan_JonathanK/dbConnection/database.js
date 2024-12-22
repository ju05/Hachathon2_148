import knex from "knex";
// import 'dotenv/config';
import dotenv from "dotenv";

dotenv.config()

const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

export const db = knex({
  client: "pg",
  connection: {
    host: PGHOST,
    port: PGPORT,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    ssl: { rejectUnauthorized: false },
    // ssl: 'false'
  },
});

export const createEnemiesTable = async () => {
    try {
        await db.schema.createTable('enemies',function(table){
            table.increments('id').primary()
            table.string('name').notNullable()
            table.integer('health').notNullable()
            table.integer('attack').notNullable()
        })
        console.log("Table created successfully");
    } catch (error) {
        console.log('Error creating table:',error);  
    }  
}

//server.js


const enemiesApiUrl = 'http://localhost:5000/enemies/';

const getEnemy = async () => {
  try {
      const response = await fetch(enemiesApiUrl);
      if (!response.ok) throw new Error("Error fetching enemies");
      return response.json();
  } catch (error) {
      console.error("Failed to fetch enemies:", error);
      return null; // Return null to handle gracefully when fetch fails
  }
};

const makeEnemiesDB = async () => {
  await createEnemiesTable()
  const enemiesObj = await getEnemy()
  console.log("Fetched enemies object:", enemiesObj);

  if(enemiesObj){
    const inserted = await db('enemies').insert(enemiesObj)
    console.log("enemies inserted:",inserted);
  }else{
    console.log("No enemies to insert");
    
  }

} 

makeEnemiesDB()
.then(()=> db.destroy())
.catch(error => console.log('Error during makeEnemiesDB: ',error));


//.env

// # PGHOST=ep-aged-fire-a23jb3lc.eu-central-1.aws.neon.tech
// # PGDATABASE=neondb
// # PGUSER=neondb_owner
// # PGPASSWORD=As5BuQ2yYFPn
// # PGPORT=5432

# NODE_ENV=development

PGHOST=localhost
PGDATABASE=Hackathon_2
PGUSER=postgres
PGPASSWORD=1234
PGPORT=5432
