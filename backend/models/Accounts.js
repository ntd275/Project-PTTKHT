const knex = require('./database')

exports.createAccount = async function (data) {
  return knex('Accounts').insert({
    'accountName': data.username,
    'password': data.password,
    'userCode': data.usercode,
    'role': data.acctype
  })
}

exports.getAccountByUsername = async function (username) {
  return knex('Accounts').where('accountName', username).first()
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
