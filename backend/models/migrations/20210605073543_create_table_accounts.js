
exports.up = function(knex) {
    return knex.schema.createTable('Accounts', (table) => {
        table.specificType('accountId', 'int(11) AUTO_INCREMENT primary key').notNullable();
        table.integer('role').notNullable();
        table.string('accountName', 30).notNullable();
        table.string('password', 250).notNullable();
        table.string('userCode', 10).notNullable();
        table.unique('accountName')
        table.unique('userCode')
    })
};

exports.down = function(knex) {
    knex.schema.dropTable('Accounts')
};
