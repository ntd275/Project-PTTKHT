
exports.up = function(knex) {
    return knex.schema.createTable('SchoolYear', (table) => {
        table.specificType('schoolYearId', 'int(11) AUTO_INCREMENT PRIMARY KEY').notNullable();
        table.string('schoolYear', 15).notNullable();
        table.date('beginSemester1').notNullable();
        table.date('endSemester1').notNullable();
        table.date('beginSemester2').notNullable();
        table.date('endSemester2').notNullable();
        table.specificType('description', 'varchar(50) CHARACTER SET utf8').notNullable();
    })
};

exports.down = function(knex) {
    knex.schema.dropTable('SchoolYear')
};
