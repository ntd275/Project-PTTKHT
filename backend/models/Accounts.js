const knex = require('./database')

exports.getAccountByUsername = async (username) => {
    let account = await knex('Accounts').where('accountName', username).first()
    return account
}

exports.getAccount = async function (id) {
    return knex('Accounts').where('accountId', id).first()
}

// exports.getAccountList = async function (page, perpage) {
//   return knex('Accounts').paginate({ perPage: perpage, currentPage: page, isLengthAware: true });
// }

exports.updatePassword = async function (username, newPassword) {
    return knex('Accounts').where('accountName', username).update('password', newPassword)
}

exports.deleteAccount = async function (id) {
    return knex('Accounts').where('accountId', id).del()
}

// exports.dropTable = async function () {
//     return knex.schema.dropTable('Accounts');
// };
