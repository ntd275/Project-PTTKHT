
exports.up = function (knex) {
    return knex.schema.createTable('Class', (table) => {
        table.specificType('classId', 'int(11) AUTO_INCREMENT PRIMARY KEY').notNullable();
        table.specificType('className', 'varchar(30) CHARACTER SET utf8').notNullable()
        table.string('classCode',10).notNullable()
        table.specificType('description', 'varchar(50) CHARACTER SET utf8').notNullable()

    })
};

exports.down = function (knex) {
    knex.schema.dropTable('Class')
};
