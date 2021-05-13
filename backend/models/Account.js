const knex = require('./database')

exports.createAccount = async function (data) {
  return knex('Accounts').insert({
    'accountName': data.accountName,
    'password': data.password,
    'userCode': data.userCode,
    'role': data.role
  })
}

exports.getAccountByUsername = async function (accountName) {
  return knex('Accounts').where('accountName', accountName).first()
}

exports.getAccount = async function (id) {
  return knex('Accounts').where('accountId', id).first()
}

exports.getAccountList = async function (page, perpage) {
  return knex('Accounts').paginate({ perPage: perpage, currentPage: page, isLengthAware: true });
}

exports.updateAccount = async function (id, data) {
  return knex('Accounts').where('accountId', id).update(data)
}

exports.deleteAccount = async function (id) {
  return knex('Accounts').where('accountId', id).del()
}

exports.dropTable = async function () {
  return knex.schema.dropTable('Accounts');
};
