
exports.up = function (knex) {
    return knex.schema.createTable('HomeroomTeacherAssignment', (table) => {
        table.specificType('homeroomTeacherAssignmentId', 'int(11) AUTO_INCREMENT PRIMARY KEY').notNullable();
        table.integer('teacherId', 11).notNullable();
        table.integer('classId', 11).notNullable();
        table.integer('schoolYearId', 11).notNullable();
        table.unique(['schoolYearId', 'teacherId'], 'teacher_scyear')
        table.unique(['schoolYearId', 'classId'], 'class_scyear')
    })
};

exports.down = function (knex) {

};
