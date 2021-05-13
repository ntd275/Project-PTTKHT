const knex = require('./database')

exports.getSpecialistAssignmentList = async () => {
    return await knex.select().table('SpecialistAssignment')
}

exports.getSpecialistAssignment = async (specialistAssignmentId) => {
    return await knex('SpecialistAssignment').where('specialistAssignmentId', specialistAssignmentId).first()
}

exports.deleteSpecialistAssignment = async (specialistAssignmentId) => {
    return await knex('SpecialistAssignment').where('specialistAssignmentId', specialistAssignmentId).del()
}

