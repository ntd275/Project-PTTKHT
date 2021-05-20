//Notes: account role:
//0: student
//1: teacher
//2: admin
const knex = require('./database')
const bcrypt = require('bcrypt')
const config = require('../config/config')

exports.getAccountList = async (page, perpage) => {
    return await knex.select('accountId','accountName', 'role', 'userCode').table('Accounts').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getAccountByUsername = async (accountName) => {
    let account = await knex('Accounts').where('accountName', accountName).first()
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

exports.editAccount = async function (id, data) {
    return await knex('Accounts')
    .where('accountId', id)
    .update({
        role: data.role,
        accountName: data.username,
        password: data.password,
        userCode: data.userCode
    })
}

exports.updatePassword = async function (accountId, newPassword) {
    let password = await bcrypt.hash(newPassword, config.saltRounds)

    return await knex('Accounts').where('accountId', accountId).update('password', password)
}

exports.deleteAccount = async function (accountId) {
    return await knex('Accounts').where('accountId', accountId).del()
}

// exports.dropTable = async function () {
//     return knex.schema.dropTable('Accounts');
// };
