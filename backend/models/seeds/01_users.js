const bcrypt = require('bcrypt')
const config = require('../../config/config')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("Accounts")
    .del()
    .then(function () {
      // Inserts seed entries
      let password = bcrypt.hashSync('12345678', config.saltRounds)
      return knex("Accounts").insert([
        {
          role: 2,
          accountName: "admin01",
          password: password,
          userCode: "AD001"
        },
      ]);
    });
};
