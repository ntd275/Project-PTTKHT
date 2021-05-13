const knex = require('./database')

exports.getAccountList = async () => {
    return await knex.select().table('Accounts')
}

exports.getAccountByUsername = async (username) => {
    let account = await knex('Accounts').where('accountName', username).first()
    return account
}

exports.getAccount = async function (accountId) {
    return knex('Accounts').where('accountId', accountId).first()
}

exports.editAccount = async function (account) {
    knex('Accounts')
    .where('accountId', account.accountId)
    .update({
        role: account.role,
        accountName: account.username,
        password: account.password,
        userCode: account.userCode
    })
}

exports.updatePassword = async function (username, newPassword) {
    return knex('Accounts').where('accountName', username).update('password', newPassword)
}

exports.deleteAccount = async function (accountId) {
    return knex('Accounts').where('accountId', accountId).del()
}

// exports.dropTable = async function () {
//     return knex.schema.dropTable('Accounts');
// };
