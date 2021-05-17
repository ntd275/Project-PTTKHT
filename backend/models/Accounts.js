const knex = require('./database')
const bcrypt = require('bcrypt')
const config = require('../config/config')

exports.getAccountList = async () => {
    return await knex.select().table('Accounts')
}

exports.getAccountByUsername = async (username) => {
    let account = await knex('Accounts').where('accountName', username).first()
    return account
}

exports.getAccount = async function (accountId) {
    return await knex('Accounts').where('accountId', accountId).first()
}

exports.createAccount = async function(account) {
    let password = await bcrypt.hash(account.password, config.saltRounds)

    return await knex("Accounts").insert([
        {
            role: account.role,
            accountName: account.accountName,
            password: password,
            userCode: account.userCode
        },
    ]);
}

exports.editAccount = async function (account) {
    return await knex('Accounts')
    .where('accountId', account.accountId)
    .update({
        role: account.role,
        accountName: account.username,
        password: account.password,
        userCode: account.userCode
    })
}

exports.updatePassword = async function (username, newPassword) {
    return await knex('Accounts').where('accountName', username).update('password', newPassword)
}

exports.deleteAccount = async function (accountId) {
    return await knex('Accounts').where('accountId', accountId).del()
}

// exports.dropTable = async function () {
//     return knex.schema.dropTable('Accounts');
// };
