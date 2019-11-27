
exports.up = (knex) => {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.string('email').unique();
      table.string('full_name').notNullable();
      table.text('address').notNullable();
      table.increments('id').primary();
      table.string('password').notNullable();
      table.bool('is_active').defaultTo(false);
      table.bool('is_admin').defaultTo(false);
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    }),
    knex.schema.createTable(('item_category'), (table) => {
      table.string('name').primary();
      table.text('description');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.integer('created_by').references('id').inTable('users');
    }),
    knex.schema.createTable('item', (table) => {
      table.increments('id').primary();
      table.bool('is_active').defaultTo(true);
      table.string('category').references('name').inTable('item_category');
      table.integer('seller_id').references('id').inTable('users').notNullable();
      table.float('starting_price').notNullable();
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
      table.timestamp('ended_at');
      table.float('final_price');
      table.string('product_title');
      table.text('product_description');
      table.integer('bid_increment_time').notNullable();
      table.float('min_bid_increment').defaultTo(10);
    }),
    knex.schema.createTable('auction_bid_log', (table) => {
      table.increments('id').primary();
      table.integer('bidder_id').references('id').inTable('users');
      table.integer('bidded_item').references('id').inTable('item');
      table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    }),
  ]);
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.dropTable('auction_bid_log'),
    knex.schema.dropTable('item'),
    knex.schema.dropTable('item_category'),
    knex.schema.dropTable('users'),
  ]);
};
