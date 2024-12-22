exports.up = function (knex) {
    return knex.schema.createTable('favorites', (table) => {
      table.increments('id').primary();  // Primary key
      table.integer('userId').notNullable();  // User identifier
      table.string('cityName').notNullable();  // City name
      table.timestamps(true, true);  // Created_at and updated_at columns
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('favorites');
  };
  