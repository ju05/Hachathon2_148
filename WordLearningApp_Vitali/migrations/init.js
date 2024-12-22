const db = require('../db/db')

module.exports.up = async function() {
    await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').unique().notNullable();
        table.string('hash').notNullable();
        table.date('created').defaultTo(db.fn.now()); 
    })

    await db.schema.createTable('cards', table => {
        table.increments('id').primary();
        table.integer('user_id');

        table.string('front').notNullable();
        table.string('back').notNullable();
        table.integer('index').notNullable();
        table.datetime('created').defaultTo(db.fn.now()).notNullable();

        table
            .foreign('user_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
    })
}

module.exports.down = async function() {
    await db.schema.dropTableIfExists('public.cards');
    await db.schema.dropTableIfExists('public.users');
}