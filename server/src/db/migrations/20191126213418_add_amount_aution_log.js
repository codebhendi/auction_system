
exports.up = (knex) => {
  return Promise.all([
    knex.schema.table('item', (table) => {
      table.dropColumn('bid_increment_time');
    }),
    knex.schema.table('auction_bid_log', (table) => {
      table.float('bidded_amount');
    }),
  ]);
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.table('item', (table) => {
      table.integer('bid_increment_time').notNullable();
    }),
    knex.schema.table('auction_bid_log', (table) => {
      table.dropColumn('bidded_amount');
    }),
  ]);
};
