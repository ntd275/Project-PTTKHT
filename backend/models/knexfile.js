// Update with your config settings.
const config = require('../config/config')

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: "20.188.120.110",
      user: "root",
      password: "A123456a@",
      database: "SOLIENLACDIENTU",
      timezone: "+00:00"
    },
    acquireConnectionTimeout: 30000
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
