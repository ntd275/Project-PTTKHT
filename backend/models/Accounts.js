//Notes: account role:
//0: student
//1: teacher
//2: admin
const knex = require('./database')
const bcrypt = require('bcrypt')
const config = require('../config/config')

exports.getAccountList = async (page, perpage) => {
    return knex.select('accountId', 'accountName', 'role', 'userCode').table('Accounts').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}
//Use for auth login
exports.getAccountByUsername = async (accountName) => {
    return knex('Accounts').where('accountName', accountName).first()
}
//Use for account get accounts
exports.getAccountsByUsername = async (accountName) => {
    return knex('Accounts').where('accountName', 'like', accountName)
}

exports.getAccount = async function (accountId) {
    return knex('Accounts').where('accountId', accountId).first()
}

exports.createAccount = async function (account) {
    return knex("Accounts").insert({
        role: account.role,
        accountName: account.accountName,
        password: account.password,
        userCode: account.userCode
    });
}

exports.editAccount = async function (id, data) {
    return knex('Accounts')
        .where('accountId', id)
        .update({
            role: data.role,
            accountName: data.username,
            password: data.password,
            userCode: data.userCode
        })
}

exports.updatePassword = async function (accountId, newPassword) {
    let password = bcrypt.hash(newPassword, config.saltRounds)

    return knex('Accounts').where('accountId', accountId).update('password', password)
}

exports.deleteAccount = async function (accountId) {
    return knex('Accounts').where('accountId', accountId).del()
}

// exports.dropTable = async function () {
//     return knex.schema.dropTable('Accounts');
// };
