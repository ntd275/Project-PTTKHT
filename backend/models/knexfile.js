// Update with your config settings.
const config = require('../config/config')

console.log(config);

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: config.dbHost,
      user: config.userDB,
      password: config.passwordDB,
      database: config.db,
      timezone: "+00:00"
    },
    acquireConnectionTimeout: 30000,
  },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
