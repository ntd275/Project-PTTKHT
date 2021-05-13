const knex = require('./database')

exports.getHomeroomTeacherAssignmentList = async () => {
    return await knex.select().table('HomeroomTeacherAssignment')
}

exports.getHomeroomTeacherAssignment = async (homeroomTeacherAssignmentId) => {
    return await knex('HomeroomTeacherAssignment').where('homeroomTeacherAssignmentId', homeroomTeacherAssignmentId).first()
}

exports.deleteHomeroomTeacherAssignment = async (homeroomTeacherAssignmentId) => {
    return await knex('HomeroomTeacherAssignment').where('homeroomTeacherAssignmentId', homeroomTeacherAssignmentId).del()
}

