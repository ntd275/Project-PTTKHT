
exports.up = function (knex) {
    return knex.schema.createTable('Attendance', (table) => {
        table.specificType('attendanceId', 'int(11) AUTO_INCREMENT PRIMARY KEY').notNullable();
        table.integer('studentId', 11).notNullable();
        table.integer('classId', 11).notNullable();
        table.integer('teacherId', 11).notNullable();
        table.integer('schoolYearId', 11).notNullable();
        table.date('date').notNullable();
        table.specificType('attendance', 'tinyint(1)').notNullable();
        table.specificType('term', 'tinyint(4)').notNullable();
    })
};

exports.down = function (knex) {
    knex.schema.dropTable('Attendance');
};
