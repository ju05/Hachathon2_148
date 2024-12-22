const knex = require('knex')
const dotenv = require('dotenv')

const {parsed: {DBUSER, DBPASSWORD, DBNAME, DBPORT}} = dotenv.config()

module.exports = db = knex({
    client: 'pg',
    connection: {
        port: DBPORT,
        user: DBUSER,
        database: DBNAME,
        password: DBPASSWORD
    }
})