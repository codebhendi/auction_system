const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
    migrations: {
      directory: path.join(__dirname, 'src', 'db', 'migrations'),
    },
  },
};
