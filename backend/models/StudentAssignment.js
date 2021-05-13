const knex = require('./database')

exports.getStudentAssignmentList = async () => {
    return await knex.select().table('StudentAssignment')
}

exports.getStudentAssignment = async (studentAssignmentId) => {
    return await knex('StudentAssignment').where('studentAssignmentId', studentAssignmentId).first()
}

exports.deleteStudentAssignment = async (studentAssignmentId) => {
    return await knex('StudentAssignment').where('studentAssignmentId', studentAssignmentId).del()
}

