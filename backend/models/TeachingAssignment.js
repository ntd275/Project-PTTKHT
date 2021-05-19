const knex = require('./database')

exports.getTeacherAssignmentList = async () => {
    return await knex.select().table('TeacherAssignment')
}

exports.getTeacherAssignment = async (teacherAssignmentId) => {
    return await knex('TeacherAssignment').where('teacherAssignmentId', teacherAssignmentId).first()
}

exports.deleteTeacherAssignment = async (teacherAssignmentId) => {
    return await knex('TeacherAssignment').where('teacherAssignmentId', teacherAssignmentId).del()
}

