const bcrypt = require('bcrypt')

exports.seed = function (knex) {
    return knex("Accounts")
        // .del()      //WARNING: Delete existing accounts
        .then(function () {
            // Inserts seed entries
            let saltRounds = 10
            let password = bcrypt.hashSync('a12345678', saltRounds)
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
