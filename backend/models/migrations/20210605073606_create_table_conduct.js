
exports.up = function(knex) {
    return knex.schema.createTable('Conduct', (table) => {
        table.specificType('conductId', 'int(11) AUTO_INCREMENT PRIMARY KEY').notNullable();
        table.integer('studentId', 11).notNullable();
        table.integer('classId', 11).notNullable();
        table.integer('teacherId', 11).notNullable();
        table.integer('schoolYearId', 11).notNullable();
        table.specificType('conduct', 'tinyint(4)').notNullable();
        table.specificType('term', 'tinyint(4)').notNullable();
        table.specificType('note', 'varchar(1000) CHARACTER SET utf8');
    })
};

exports.down = function(knex) {
  
};
