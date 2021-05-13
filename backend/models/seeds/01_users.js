const bcrypt = require('bcrypt')
const config = require('../../config/config')

console.log(config)

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex("Accounts")
        .del()      //WARNING: Delete existing accounts
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
